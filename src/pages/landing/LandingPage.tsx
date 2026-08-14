import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Bot, ChevronRight, Zap, Shield, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-wider">LUNEX</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              window.open('/auth/discord', '_blank');
            }}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Log In
          </button>
          <Link 
            to="/dashboard" 
            className="bg-white text-slate-950 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-200 transition-colors"
          >
            Open Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-slate-300">LUNEX 2.0 is now live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Build Your Discord Bot. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Without The Complexity.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            Create, configure, and manage professional Discord bots with an intuitive visual builder. Deploy in seconds, manage forever.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link 
              to="/dashboard/bots/create" 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-base font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              Create Your Bot <ChevronRight className="w-5 h-5" />
            </Link>
            <a 
              href="#features" 
              className="w-full sm:w-auto bg-slate-900/50 hover:bg-slate-800 text-white border border-slate-800 px-8 py-4 rounded-full text-base font-medium transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              Explore Features
            </a>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-32 mb-20 text-left"
        >
          <div className="glass-panel p-8 rounded-2xl">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Visual Builder</h3>
            <p className="text-slate-400 leading-relaxed">Create commands and automations through our intuitive interface. No coding required.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Instant Deploy</h3>
            <p className="text-slate-400 leading-relaxed">Your bots are hosted on our edge infrastructure. High availability and zero latency.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl">
            <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure by Design</h3>
            <p className="text-slate-400 leading-relaxed">We protect your tokens and user data with enterprise-grade encryption and access controls.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
