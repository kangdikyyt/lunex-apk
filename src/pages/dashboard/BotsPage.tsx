import { Link } from "react-router-dom";
import { Bot, Plus, Circle, Terminal, Server } from "lucide-react";
import { motion } from "motion/react";

export default function BotsPage() {
  // Mock data for initial UI
  const bots = [
    { id: "1", name: "Lunex Helper", status: "online", servers: 12, commands: 24 },
    { id: "2", name: "TicketMaster", status: "offline", servers: 3, commands: 8 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50">My Bots</h1>
          <p className="text-slate-400 mt-1">Manage and monitor your Discord bots.</p>
        </div>
        <Link 
          to="/dashboard/bots/create"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Bot
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={bot.id}
          >
            <Link 
              to={`/dashboard/bots/${bot.id}`}
              className="block h-full glass-panel p-6 rounded-2xl hover:border-slate-700 transition-colors group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                  <Bot className="w-6 h-6 text-slate-300" />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/50 px-2.5 py-1 rounded-full border border-slate-800">
                  <Circle className={`w-2.5 h-2.5 fill-current ${bot.status === 'online' ? 'text-emerald-500' : 'text-slate-500'}`} />
                  <span className="text-xs font-medium text-slate-300 capitalize">{bot.status}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-slate-100 mb-4">{bot.name}</h3>
              
              <div className="flex items-center gap-4 text-sm text-slate-400 border-t border-slate-800/50 pt-4 mt-auto">
                <div className="flex items-center gap-1.5">
                  <Server className="w-4 h-4" />
                  <span>{bot.servers} Servers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  <span>{bot.commands} Commands</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
