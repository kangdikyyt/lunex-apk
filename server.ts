import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Client, GatewayIntentBits } from "discord.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import * as botService from "./server/services/botService";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "default_super_secret_key";
const APP_URL = process.env.APP_URL || "http://localhost:3000";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // --- Auth Middleware ---
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.lunex_session;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, SESSION_SECRET);
      (req as any).user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid session" });
    }
  };

  // --- Auth Routes ---
  app.get("/auth/discord", (req, res) => {
    const redirectUri = encodeURIComponent(`${APP_URL}/auth/discord/callback`);
    const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20guilds`;
    res.redirect(discordUrl);
  });

  app.get("/auth/discord/callback", async (req, res) => {
    const code = req.query.code as string;
    if (!code) return res.status(400).send("No code provided");

    try {
      // 1. Exchange code for access token
      const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID,
          client_secret: DISCORD_CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
          redirect_uri: `${APP_URL}/auth/discord/callback`,
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenData.access_token) throw new Error("Failed to get access token");

      // 2. Fetch user profile
      const userResponse = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      
      const userData = await userResponse.json();

      // 3. Create session JWT
      const sessionToken = jwt.sign(
        { id: userData.id, username: userData.username, avatar: userData.avatar },
        SESSION_SECRET,
        { expiresIn: "7d" }
      );

      // 4. Set httpOnly cookie
      res.cookie("lunex_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect("/dashboard");
    } catch (error) {
      console.error("OAuth Error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    res.json((req as any).user);
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("lunex_session");
    res.json({ success: true });
  });

  // --- Workspace APIs ---
  app.get("/api/bots/:id/files", requireAuth, async (req, res) => {
    try {
      const tree = await botService.getFileTree(req.params.id);
      res.json(tree);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/bots/:id/files/*", requireAuth, async (req, res) => {
    try {
      const filePath = req.params[0];
      const content = await botService.readFile(req.params.id, filePath);
      res.json({ content });
    } catch (err: any) {
      res.status(404).json({ error: "File not found" });
    }
  });

  app.put("/api/bots/:id/files/*", requireAuth, async (req, res) => {
    try {
      const filePath = req.params[0];
      await botService.writeFile(req.params.id, filePath, req.body.content);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/bots/:id/start", requireAuth, async (req, res) => {
    try {
      // Note: in a real app, token should be decrypted from the DB based on req.params.id
      // For now, we expect it in the body for testing
      const { token } = req.body;
      if (!token) return res.status(400).json({ error: "Token required to start" });
      
      const result = await botService.startBot(req.params.id, token);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/bots/:id/stop", requireAuth, async (req, res) => {
    try {
      const result = await botService.stopBot(req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/bots/:id/status", requireAuth, (req, res) => {
    res.json(botService.getBotStatus(req.params.id));
  });

  app.get("/api/bots/:id/logs", requireAuth, (req, res) => {
    res.json(botService.getBotLogs(req.params.id));
  });

  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
