import { useEffect, useState } from "react";
import { User, Lock, Key, Monitor, Save, Trash, Loader2 } from "lucide-react";
import { getCurrentUser } from "../api/auth";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error("Failed to load current user:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading account settings...
      </div>
    );
  }

  const displayName = user?.full_name || "Unknown User";
  const email = user?.email || "unknown@example.com";
  const role = user?.role || "user";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Account & Security</h2>

      <div className="glass p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyber-cyan to-cyber-blue flex items-center justify-center text-2xl font-bold">
            {initial}
          </div>

          <div>
            <h3 className="text-lg font-semibold">{displayName}</h3>
            <p className="text-sm text-gray-400">{email}</p>
            <p className="text-xs text-cyber-cyan mt-1">Role: {role}</p>
          </div>

          <button className="btn-secondary ml-auto opacity-60 cursor-not-allowed">
            Change Avatar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Display Name
            </label>
            <input value={displayName} readOnly className="input-field" />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Contact Email
            </label>
            <input value={email} readOnly className="input-field" />
          </div>
        </div>
      </div>

      <div className="glass p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Lock size={18} className="text-cyber-cyan" />
          Security & API
        </h3>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            API Secret Key
          </label>

          <div className="flex gap-2">
            <input
              value="Managed server-side only"
              readOnly
              className="input-field font-mono bg-navy-800/60"
            />
            <button className="btn-secondary px-4 opacity-60 cursor-not-allowed">
              <Key size={16} />
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Internal API keys are never exposed to the frontend.
          </p>
        </div>

        <div className="pt-4 border-t border-white/10">
          <label className="block text-sm text-gray-400 mb-3">
            Password Update
          </label>

          <div className="space-y-3 max-w-sm">
            <input
              type="password"
              placeholder="Current Password"
              className="input-field text-sm"
              disabled
            />
            <input
              type="password"
              placeholder="New Password"
              className="input-field text-sm"
              disabled
            />
            <button className="btn-primary opacity-60 cursor-not-allowed">
              Update Password
            </button>
          </div>
        </div>
      </div>

      <div className="glass p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Monitor size={18} className="text-cyber-blue" />
          Active Sessions
        </h3>

        <div className="space-y-2">
          {[
            "Chrome • Windows • Current session",
            "API Gateway • JWT Protected • Active",
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded bg-navy-700/30 border border-white/5"
            >
              <span className="text-sm">{s}</span>
              <button className="text-xs text-red-400/60 flex items-center gap-1 cursor-not-allowed">
                <Trash size={12} />
                Revoke
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Save size={16} />
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}