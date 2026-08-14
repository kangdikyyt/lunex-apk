import { Shield, User, AlertTriangle, Key } from "lucide-react";

export default function AccountSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-100">Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
            <input
              type="text"
              disabled
              defaultValue="Connected via Discord"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 focus:outline-none opacity-70 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-slate-500">Your profile information is synced with your Discord account.</p>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-l-4 border-l-blue-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-100">Security</h2>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
            <div>
              <h3 className="font-medium text-slate-200">Active Sessions</h3>
              <p className="text-sm text-slate-400">Manage devices currently logged in to your account.</p>
            </div>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors">
              View Sessions
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
            <div>
              <h3 className="font-medium text-slate-200">Bot Token Encryption</h3>
              <p className="text-sm text-slate-400">All your Discord bot tokens are encrypted at rest using AES-256-GCM.</p>
            </div>
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <Key className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-red-500/20 bg-red-950/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-sm font-semibold transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
