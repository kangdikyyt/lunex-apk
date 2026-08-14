import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { 
  Play, Square, RotateCw, FileCode, Folder, 
  Terminal as TerminalIcon, Save, Settings, 
  Activity, AlertCircle, CheckCircle2,
  File
} from "lucide-react";
import { cn } from "../../lib/utils";

// --- Types ---
type FileNode = {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
};

export default function BotIdePage() {
  const { id } = useParams();
  
  // State
  const [files, setFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, boolean>>({});
  
  const [logs, setLogs] = useState<any[]>([]);
  const [status, setStatus] = useState<"online" | "offline" | "error" | "starting">("offline");
  const [metrics, setMetrics] = useState({ uptime: 0, memory: 0 });
  const [token, setToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // --- File System Operations ---
  const fetchFiles = async () => {
    try {
      const res = await fetch(`/api/bots/${id}/files`);
      if (res.ok) setFiles(await res.json());
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  const openFile = async (path: string) => {
    if (fileContents[path] !== undefined) {
      setActiveFile(path);
      return;
    }
    
    try {
      const res = await fetch(`/api/bots/${id}/files/${encodeURIComponent(path)}`);
      if (res.ok) {
        const { content } = await res.json();
        setFileContents(prev => ({ ...prev, [path]: content }));
        setActiveFile(path);
      }
    } catch (err) {
      console.error("Failed to open file", err);
    }
  };

  const saveFile = async () => {
    if (!activeFile || !unsavedChanges[activeFile]) return;
    
    try {
      const content = fileContents[activeFile];
      await fetch(`/api/bots/${id}/files/${encodeURIComponent(activeFile)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      setUnsavedChanges(prev => ({ ...prev, [activeFile]: false }));
    } catch (err) {
      console.error("Failed to save", err);
    }
  };

  // --- Runtime Operations ---
  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/bots/${id}/status`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
        if (data.uptime !== undefined) {
          setMetrics({ uptime: data.uptime, memory: data.memory });
        }
      }
      
      const logsRes = await fetch(`/api/bots/${id}/logs`);
      if (logsRes.ok) {
        setLogs(await logsRes.json());
      }
    } catch (err) {
      console.error("Status fetch failed", err);
    }
  };

  const startBot = async () => {
    if (!token) {
      setShowTokenInput(true);
      return;
    }
    
    setStatus("starting");
    try {
      await fetch(`/api/bots/${id}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      fetchStatus();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const stopBot = async () => {
    try {
      await fetch(`/api/bots/${id}/stop`, { method: "POST" });
      setStatus("offline");
      fetchStatus();
    } catch (err) {
      console.error(err);
    }
  };

  const restartBot = async () => {
    await stopBot();
    setTimeout(startBot, 1000);
  };

  // --- Lifecycle ---
  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    // Keyboard shortcut for save
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveFile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, fileContents, unsavedChanges]);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // --- Renders ---
  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.path}>
        <div 
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 cursor-pointer text-sm transition-colors",
            activeFile === node.path ? "bg-primary/20 text-primary" : "text-slate-300 hover:bg-slate-800/50"
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => node.type === "file" && openFile(node.path)}
        >
          {node.type === "directory" ? (
            <Folder className="w-4 h-4 text-blue-400" />
          ) : (
            <File className="w-4 h-4 text-slate-400" />
          )}
          <span className="truncate">{node.name}</span>
          {unsavedChanges[node.path] && <span className="w-2 h-2 rounded-full bg-amber-500 ml-auto" />}
        </div>
        {node.children && renderFileTree(node.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="h-[calc(100vh-6rem)] -mt-4 -mx-4 lg:-mx-8 lg:-mt-8 flex flex-col bg-[#020617] text-slate-300 font-sans border-t border-slate-800">
      
      {/* TOOLBAR */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/50 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800">
            {status === "online" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
             status === "error" ? <AlertCircle className="w-4 h-4 text-red-500" /> :
             status === "starting" ? <Activity className="w-4 h-4 text-blue-500 animate-pulse" /> :
             <div className="w-4 h-4 rounded-full border-2 border-slate-500" />}
            <span className="text-sm font-medium capitalize">{status}</span>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-800 pl-4">
            <button 
              onClick={startBot}
              disabled={status === "online" || status === "starting"}
              className="p-2 hover:bg-slate-800 rounded-lg text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Start"
            >
              <Play className="w-4 h-4" />
            </button>
            <button 
              onClick={stopBot}
              disabled={status === "offline"}
              className="p-2 hover:bg-slate-800 rounded-lg text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Stop"
            >
              <Square className="w-4 h-4" />
            </button>
            <button 
              onClick={restartBot}
              disabled={status === "offline"}
              className="p-2 hover:bg-slate-800 rounded-lg text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Restart"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {status === "online" && (
            <>
              <div className="flex items-center gap-2 text-slate-400">
                <Activity className="w-4 h-4" />
                <span>CPU: &lt; 1%</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Activity className="w-4 h-4" />
                <span>Mem: {metrics.memory} MB</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 border-r border-slate-800 pr-4">
                <span>Uptime: {metrics.uptime}s</span>
              </div>
            </>
          )}

          <button 
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Bot Token</span>
          </button>
          <button 
            onClick={saveFile}
            disabled={!activeFile || !unsavedChanges[activeFile]}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {showTokenInput && (
        <div className="absolute top-16 right-4 z-50 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl w-80">
          <h4 className="font-medium text-slate-200 mb-2">Configure Bot Token</h4>
          <input 
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Paste Discord Bot Token here..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary mb-3"
          />
          <button 
            onClick={() => setShowTokenInput(false)}
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
          >
            Save Token (Session Only)
          </button>
          <p className="text-xs text-slate-500 mt-2">For preview purposes, token is not persisted permanently.</p>
        </div>
      )}

      {/* MAIN WORKSPACE */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* SIDEBAR */}
          <Panel defaultSize={20} minSize={15} maxSize={30} className="border-r border-slate-800 bg-[#0f172a]">
            <div className="flex items-center justify-between p-3 border-b border-slate-800">
              <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Explorer</span>
            </div>
            <div className="py-2 overflow-y-auto h-full pb-10">
              {files.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  Initializing workspace...
                </div>
              ) : (
                renderFileTree(files)
              )}
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-primary/50 transition-colors cursor-col-resize" />

          {/* EDITOR & TERMINAL */}
          <Panel defaultSize={80}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={30}>
                {activeFile ? (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center px-4 h-10 border-b border-slate-800 bg-[#0f172a] text-sm text-slate-300">
                      <FileCode className="w-4 h-4 mr-2 text-primary" />
                      {activeFile}
                      {unsavedChanges[activeFile] && <span className="ml-2 w-2 h-2 rounded-full bg-amber-500" />}
                    </div>
                    <div className="flex-1 relative">
                      <Editor
                        height="100%"
                        language={activeFile.endsWith(".ts") ? "typescript" : activeFile.endsWith(".json") ? "json" : "javascript"}
                        theme="vs-dark"
                        value={fileContents[activeFile] || ""}
                        onChange={(value) => {
                          setFileContents(prev => ({ ...prev, [activeFile]: value || "" }));
                          setUnsavedChanges(prev => ({ ...prev, [activeFile]: true }));
                        }}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                          padding: { top: 16 },
                          wordWrap: "on",
                          scrollBeyondLastLine: false,
                          smoothScrolling: true,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 flex-col">
                    <FileCode className="w-16 h-16 mb-4 opacity-20" />
                    <p>Select a file from the explorer to start coding.</p>
                  </div>
                )}
              </Panel>

              <PanelResizeHandle className="h-1 bg-slate-800 hover:bg-primary/50 transition-colors cursor-row-resize" />

              <Panel defaultSize={30} minSize={20}>
                <div className="h-full flex flex-col bg-[#050505] border-t border-slate-800">
                  <div className="flex items-center px-4 h-10 border-b border-slate-800/50 bg-[#0a0a0a] text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    <TerminalIcon className="w-4 h-4 mr-2" />
                    Terminal & Logs
                  </div>
                  <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
                    {logs.length === 0 ? (
                      <p className="text-slate-600 italic">No logs yet. Start the bot to view terminal output.</p>
                    ) : (
                      <div className="space-y-1">
                        {logs.map((log, i) => (
                          <div key={i} className={cn(
                            "flex items-start gap-4 hover:bg-slate-900/50 px-2 py-0.5 rounded",
                            log.type === "ERROR" ? "text-red-400" :
                            log.type === "WARN" ? "text-amber-400" :
                            log.type === "DEBUG" ? "text-slate-500" : "text-slate-300"
                          )}>
                            <span className="text-slate-600 shrink-0 text-xs mt-0.5">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            <span className="whitespace-pre-wrap font-mono break-all">{log.message}</span>
                          </div>
                        ))}
                        <div ref={logsEndRef} />
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}