import { useState } from 'react';
import { mockAuditLogs } from '../lib/mockData';
import { Search, Filter, ShieldCheck, XCircle } from 'lucide-react';

export default function AuditLogs() {
  const [filter, setFilter] = useState('');
  const logs = mockAuditLogs.filter(l => l.action.toLowerCase().includes(filter.toLowerCase()) || l.user.includes(filter));
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><h2 className="text-2xl font-bold">Audit Trail</h2><div className="flex gap-2 w-full sm:w-auto"><div className="relative flex-1 sm:w-64"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" /><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Filter by action/user..." className="input-field pl-9 text-sm" /></div><button className="btn-secondary"><Filter size={18}/></button></div></div>
      <div className="glass overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-navy-800/60 text-gray-400 uppercase text-xs tracking-wider"><tr><th className="p-4">Timestamp</th><th className="p-4">User</th><th className="p-4 hidden md:table-cell">Action</th><th className="p-4 hidden lg:table-cell">IP Address</th><th className="p-4 text-right">Status</th></tr></thead><tbody className="divide-y divide-white/5">
        {logs.map(log => (<tr key={log.id} className="hover:bg-white/5 transition font-mono text-xs"><td className="p-4 text-gray-400">{log.time}</td><td className="p-4">{log.user}</td><td className="p-4 hidden md:table-cell text-gray-200">{log.action}</td><td className="p-4 hidden lg:table-cell text-gray-500">{log.ip}</td><td className="p-4 text-right"><span className={`badge ${log.status === 'success' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>{log.status === 'success' ? <ShieldCheck size={12} className="inline mr-1"/> : <XCircle size={12} className="inline mr-1"/>}{log.status.toUpperCase()}</span></td></tr>))}
      </tbody></table></div></div>
    </div>
  );
}
