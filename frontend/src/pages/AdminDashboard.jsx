import { Activity, ShieldAlert, HardDrive, Network } from 'lucide-react';

export default function AdminDashboard() {
  const bars = [35, 50, 70, 45, 80, 60, 90];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Admin Control Center</h2><span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs border border-green-500/30">System Online</span></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-4 flex items-center gap-4"><div className="p-3 rounded-lg bg-cyber-blue/20"><Activity size={20} className="text-cyber-blue"/></div><div><p className="text-sm text-gray-400">Processed Jobs</p><p className="text-xl font-bold">1,248</p></div></div>
        <div className="glass p-4 flex items-center gap-4"><div className="p-3 rounded-lg bg-red-500/20"><ShieldAlert size={20} className="text-red-400"/></div><div><p className="text-sm text-gray-400">Failed Logins (24h)</p><p className="text-xl font-bold">12</p></div></div>
        <div className="glass p-4 flex items-center gap-4"><div className="p-3 rounded-lg bg-cyber-amber/20"><HardDrive size={20} className="text-cyber-amber"/></div><div><p className="text-sm text-gray-400">Storage Used</p><p className="text-xl font-bold">68.4 GB</p></div></div>
        <div className="glass p-4 flex items-center gap-4"><div className="p-3 rounded-lg bg-cyber-teal/20"><Network size={20} className="text-cyber-teal"/></div><div><p className="text-sm text-gray-400">Active Sessions</p><p className="text-xl font-bold">43</p></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6"><h3 className="text-lg font-semibold mb-6">AI Query Volume</h3><div className="flex items-end justify-between h-40 gap-2">{bars.map((h, i) => (<div key={i} className="flex flex-col items-center gap-2 flex-1"><div className="w-full bg-gradient-to-t from-cyber-cyan/50 to-cyber-blue rounded-t transition-all hover:opacity-80" style={{height: `${h}%`}}></div><span className="text-[10px] text-gray-500">{days[i]}</span></div>))}</div></div>
        <div className="glass p-6"><h3 className="text-lg font-semibold mb-4">Security Monitoring</h3><div className="space-y-4"><div className="flex justify-between items-center p-3 rounded bg-navy-700/30 border border-white/5"><span className="text-sm text-gray-300">Firewall Status</span><span className="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded">ACTIVE</span></div><div className="flex justify-between items-center p-3 rounded bg-navy-700/30 border border-white/5"><span className="text-sm text-gray-300">Rate Limiting</span><span className="text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 px-2 py-1 rounded">ENFORCED</span></div><div className="flex justify-between items-center p-3 rounded bg-navy-700/30 border border-white/5"><span className="text-sm text-gray-300">Data Encryption</span><span className="text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 px-2 py-1 rounded">AES-256</span></div></div></div>
      </div>
    </div>
  );
}
