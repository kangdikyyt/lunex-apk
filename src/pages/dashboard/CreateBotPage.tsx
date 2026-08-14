import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Shield, Ticket, Hand, Wrench, Users, ArrowRight } from "lucide-react";

export default function CreateBotPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("blank");

  const templates = [
    { id: "blank", name: "Start from Scratch", description: "Empty bot with no pre-configured commands.", icon: Bot },
    { id: "mod", name: "Moderation Bot", description: "Includes /ban, /kick, /mute, and auto-mod filters.", icon: Shield },
    { id: "ticket", name: "Ticket Bot", description: "Advanced ticket system with transcripts and categories.", icon: Ticket },
    { id: "welcome", name: "Welcome Bot", description: "Auto-assign roles and send customizable welcome cards.", icon: Hand },
    { id: "utility", name: "Utility Bot", description: "Server stats, info commands, and useful tools.", icon: Wrench },
    { id: "community", name: "Community Bot", description: "Leveling system, economy, and fun commands.", icon: Users },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call and redirect
    setTimeout(() => {
      navigate("/dashboard/bots/123");
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">Create New Bot</h1>
        <p className="text-slate-400 mt-1">Configure your new Discord bot and choose a starting template.</p>
      </div>

      <form onSubmit={handleCreate} className="space-y-8">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">1. Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">Bot Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Server Guardian"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-2xl">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">2. Choose Template</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                }`}
              >
                <template.icon className={`w-8 h-8 mb-3 ${selectedTemplate === template.id ? "text-primary" : "text-slate-400"}`} />
                <h3 className="font-medium text-slate-100 mb-1">{template.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!name}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-8 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
          >
            Create Bot <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
