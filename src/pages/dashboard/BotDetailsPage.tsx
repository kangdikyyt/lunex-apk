import { Routes, Route, Link, useLocation, useParams } from "react-router-dom";
import { Terminal, Settings as SettingsIcon, LayoutDashboard, Activity, FileCode2, Play } from "lucide-react";
import { cn } from "../../lib/utils";
import BotIdePage from "./BotIdePage";

// Mock sub-pages for demonstration
const BotOverview = () => <div className="p-6 glass-panel rounded-2xl"><h3 className="text-lg font-medium mb-4">Bot Overview</h3><p className="text-slate-400">Status, servers, and general analytics will appear here.</p></div>;
const BotAutomation = () => <div className="p-6 glass-panel rounded-2xl"><h3 className="text-lg font-medium mb-4">Automation Builder</h3><p className="text-slate-400">Trigger &gt; Condition &gt; Action visual builder goes here.</p></div>;
const BotSettings = () => <div className="p-6 glass-panel rounded-2xl"><h3 className="text-lg font-medium mb-4">Bot Settings</h3><p className="text-slate-400">Token configuration and general preferences.</p></div>;

// Command Builder Page
const CommandBuilder = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 glass-panel rounded-2xl overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <h3 className="font-medium text-sm">Commands</h3>
          <button className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">New +</button>
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          <div className="px-3 py-2 bg-primary/10 text-primary rounded-lg border border-primary/20 cursor-pointer text-sm mb-1">/help</div>
          <div className="px-3 py-2 text-slate-400 hover:bg-slate-800/50 rounded-lg cursor-pointer text-sm mb-1">/ping</div>
          <div className="px-3 py-2 text-slate-400 hover:bg-slate-800/50 rounded-lg cursor-pointer text-sm mb-1">/ticket</div>
        </div>
      </div>
      
      <div className="lg:col-span-2 glass-panel rounded-2xl p-6 h-[600px] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Command: /help</h2>
          <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Save Changes</button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Command Name</label>
            <input type="text" defaultValue="help" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
            <input type="text" defaultValue="Shows a list of available commands." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-primary" />
          </div>
          
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-sm font-medium text-slate-300 mb-4">Response Action</h3>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-medium text-slate-500 mb-2">SEND MESSAGE</div>
              <textarea 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-primary min-h-[100px]"
                defaultValue="Here are my commands!"
              />
            </div>
            <button className="mt-4 w-full py-2 border border-dashed border-slate-700 rounded-lg text-slate-400 text-sm hover:text-slate-300 hover:border-slate-500 transition-colors">+ Add Embed</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BotDetailsPage() {
  const location = useLocation();
  const { id } = useParams();
  const basePath = `/dashboard/bots/${id}`;

  const tabs = [
    { name: "Overview", path: "", icon: LayoutDashboard },
    { name: "Visual Builder", path: "/commands", icon: Terminal },
    { name: "Code Mode", path: "/ide", icon: FileCode2 },
    { name: "Automation", path: "/automation", icon: Activity },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50">Lunex Helper</h1>
          <p className="text-slate-400 mt-1">ID: {id}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/dashboard/bots/${id}/ide`} className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            <FileCode2 className="w-4 h-4" />
            Open Code Mode
          </Link>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-slate-800/50 hide-scrollbar shrink-0">
        {tabs.map((tab) => {
          const fullPath = `${basePath}${tab.path}`;
          const isActive = location.pathname === fullPath;
          
          return (
            <Link
              key={tab.name}
              to={fullPath}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                isActive 
                  ? "border-primary text-primary" 
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </Link>
          );
        })}
      </div>

      <div className="pt-2 flex-1 relative">
        <Routes>
          <Route path="/" element={<BotOverview />} />
          <Route path="/commands" element={<CommandBuilder />} />
          <Route path="/ide" element={<BotIdePage />} />
          <Route path="/automation" element={<BotAutomation />} />
          <Route path="/settings" element={<BotSettings />} />
        </Routes>
      </div>
    </div>
  );
}
