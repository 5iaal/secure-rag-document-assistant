import { User, Lock, Key, Monitor, Save, Trash } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Account & Security</h2>
      <div className="glass p-6 space-y-6">
        <div className="flex items-center gap-4"><div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyber-cyan to-cyber-blue flex items-center justify-center text-2xl font-bold">A</div><div><h3 className="text-lg font-semibold">Admin User</h3><p className="text-sm text-gray-400">admin@secure-rag.io</p></div><button className="btn-secondary ml-auto">Change Avatar</button></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10"><div><label className="block text-sm text-gray-400 mb-2">Display Name</label><input defaultValue="Admin User" className="input-field" /></div><div><label className="block text-sm text-gray-400 mb-2">Contact Email</label><input defaultValue="admin@secure-rag.io" className="input-field" /></div></div>
      </div>
      <div className="glass p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold"><Lock size={18} className="text-cyber-cyan"/> Security & API</h3>
        <div><label className="block text-sm text-gray-400 mb-2">API Secret Key</label><div className="flex gap-2"><input value="sk_live_8f3a...c21d" readOnly className="input-field font-mono bg-navy-800/60" /><button className="btn-secondary px-4"><Key size={16}/></button></div><p className="text-xs text-gray-500 mt-1">Rotate keys quarterly. Never expose in client code.</p></div>
        <div className="pt-4 border-t border-white/10"><label className="block text-sm text-gray-400 mb-3">Password Update</label><div className="space-y-3 max-w-sm"><input type="password" placeholder="Current Password" className="input-field text-sm" /><input type="password" placeholder="New Password" className="input-field text-sm" /><button className="btn-primary">Update Password</button></div></div>
      </div>
      <div className="glass p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold"><Monitor size={18} className="text-cyber-blue"/> Active Sessions</h3>
        <div className="space-y-2">{['Chrome â€¢ macOS â€¢ Current', 'Safari â€¢ iOS â€¢ Active 2h ago'].map((s, i) => (<div key={i} className="flex items-center justify-between p-3 rounded bg-navy-700/30 border border-white/5"><span className="text-sm">{s}</span><button className="text-xs text-red-400 hover:underline flex items-center gap-1"><Trash size={12}/> Revoke</button></div>))}</div>
      </div>
      <div className="flex justify-end"><button className="btn-primary flex items-center gap-2"><Save size={16}/> Save Changes</button></div>
    </div>
  );
}
