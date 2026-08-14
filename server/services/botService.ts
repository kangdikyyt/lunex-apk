import fs from "fs/promises";
import path from "path";
import { spawn, ChildProcess } from "child_process";

const WORKSPACES_DIR = path.join(process.cwd(), "bot-workspaces");

interface BotProcess {
  process: ChildProcess;
  logs: Array<{ type: "INFO" | "WARN" | "ERROR" | "DEBUG"; message: string; timestamp: string }>;
  startTime: number;
}

const runningBots = new Map<string, BotProcess>();

const sanitizePath = (botId: string, filePath: string) => {
  const root = path.join(WORKSPACES_DIR, botId);
  const resolved = path.join(root, filePath);
  if (!resolved.startsWith(root)) {
    throw new Error("Invalid path");
  }
  return resolved;
};

export const initializeBotWorkspace = async (botId: string) => {
  const botDir = path.join(WORKSPACES_DIR, botId);
  await fs.mkdir(botDir, { recursive: true });

  // Check if index.ts exists, if not, create template
  try {
    await fs.access(path.join(botDir, "index.ts"));
  } catch {
    await fs.writeFile(
      path.join(botDir, "index.ts"),
      `import { Client, GatewayIntentBits } from 'discord.js';\n\nconst client = new Client({ \n  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] \n});\n\nclient.on('ready', () => {\n  console.log(\`Logged in as ${client.user?.tag}!\`);\n});\n\nclient.on('messageCreate', (message) => {\n  if (message.content === '!ping') {\n    message.reply('Pong!');\n  }\n});\n\nclient.login(process.env.DISCORD_TOKEN);\n`
    );
    await fs.writeFile(
      path.join(botDir, "package.json"),
      JSON.stringify({
        name: `bot-${botId}`,
        version: "1.0.0",
        main: "index.ts",
        dependencies: {
          "discord.js": "^14.14.1",
          "dotenv": "^16.4.5"
        }
      }, null, 2)
    );
  }
};

export const getFileTree = async (botId: string, dir: string = ""): Promise<any[]> => {
  const root = path.join(WORKSPACES_DIR, botId);
  const targetDir = path.join(root, dir);
  
  if (!targetDir.startsWith(root)) throw new Error("Invalid path");
  
  try {
    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    const result = [];
    
    for (const entry of entries) {
      if (entry.name === "node_modules") continue; // Hide node_modules
      
      const relativePath = path.join(dir, entry.name).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        result.push({
          name: entry.name,
          path: relativePath,
          type: "directory",
          children: await getFileTree(botId, relativePath)
        });
      } else {
        result.push({
          name: entry.name,
          path: relativePath,
          type: "file"
        });
      }
    }
    
    // Sort directories first
    return result.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === "directory" ? -1 : 1;
    });
  } catch (err) {
    return [];
  }
};

export const readFile = async (botId: string, filePath: string) => {
  const safePath = sanitizePath(botId, filePath);
  return fs.readFile(safePath, "utf-8");
};

export const writeFile = async (botId: string, filePath: string, content: string) => {
  const safePath = sanitizePath(botId, filePath);
  await fs.mkdir(path.dirname(safePath), { recursive: true });
  await fs.writeFile(safePath, content, "utf-8");
};

export const startBot = async (botId: string, token: string) => {
  if (runningBots.has(botId)) {
    throw new Error("Bot is already running");
  }

  const botDir = path.join(WORKSPACES_DIR, botId);
  await initializeBotWorkspace(botId);

  const logs: Array<{ type: "INFO" | "WARN" | "ERROR" | "DEBUG"; message: string; timestamp: string }> = [];
  const addLog = (type: "INFO" | "WARN" | "ERROR" | "DEBUG", message: string) => {
    logs.push({ type, message: message.trim(), timestamp: new Date().toISOString() });
    if (logs.length > 500) logs.shift(); // Keep last 500 logs
  };

  addLog("INFO", "Starting bot process...");
  
  // Use tsx to run typescript natively. 
  // We use npx to ensure it runs from local node_modules
  const child = spawn("npx", ["tsx", "index.ts"], {
    cwd: botDir,
    env: { ...process.env, DISCORD_TOKEN: token }
  });

  runningBots.set(botId, { process: child, logs, startTime: Date.now() });

  child.stdout.on("data", (data) => {
    addLog("INFO", data.toString());
  });

  child.stderr.on("data", (data) => {
    addLog("ERROR", data.toString());
  });

  child.on("close", (code) => {
    addLog(code === 0 ? "INFO" : "ERROR", `Process exited with code ${code}`);
    runningBots.delete(botId);
  });

  return { success: true };
};

export const stopBot = async (botId: string) => {
  const botInfo = runningBots.get(botId);
  if (!botInfo) return { success: false, message: "Bot is not running" };

  botInfo.process.kill();
  botInfo.logs.push({ type: "WARN", message: "Bot stopped manually.", timestamp: new Date().toISOString() });
  runningBots.delete(botId);
  
  return { success: true };
};

export const getBotStatus = (botId: string) => {
  const botInfo = runningBots.get(botId);
  if (!botInfo) return { status: "offline" };

  return {
    status: "online",
    uptime: Math.floor((Date.now() - botInfo.startTime) / 1000),
    // Mock memory for preview, as actual process memory is complex to get cross-platform cleanly
    memory: Math.floor(Math.random() * 20 + 30) // ~30-50MB
  };
};

export const getBotLogs = (botId: string) => {
  const botInfo = runningBots.get(botId);
  return botInfo ? botInfo.logs : [];
};
