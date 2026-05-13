import { useState } from 'react';
import { mockDocuments } from '../lib/mockData';
import { Search, Filter, Download, Trash2, FileText } from 'lucide-react';

export default function MyDocuments() {
  const [search, setSearch] = useState('');
  const filtered = mockDocuments.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  const StatusBadge = ({ status }) => (<span className={`badge ${status === 'Verified' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-cyber-amber/20 text-cyber-amber border-cyber-amber/30'}`}>{status}</span>);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><h2 className="text-2xl font-bold">Document Vault</h2><div className="flex gap-2 w-full sm:w-auto"><div className="relative flex-1 sm:w-64"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search documents..." className="input-field pl-9 text-sm" /></div><button className="btn-secondary"><Filter size={18}/></button></div></div>
      <div className="glass overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-navy-800/60 text-gray-400 uppercase text-xs tracking-wider"><tr><th className="p-4">Document</th><th className="p-4">Status</th><th className="p-4 hidden md:table-cell">Integrity</th><th className="p-4 hidden lg:table-cell">Uploaded</th><th className="p-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-white/5">
        {filtered.map(doc => (<tr key={doc.id} className="hover:bg-white/5 transition"><td className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded bg-cyber-cyan/10"><FileText size={18} className="text-cyber-cyan"/></div><div><p className="font-medium">{doc.name}</p><p className="text-xs text-gray-500">{doc.size}</p></div></div></td><td className="p-4"><StatusBadge status={doc.status} /></td><td className="p-4 hidden md:table-cell font-mono text-xs text-gray-400">{doc.integrity}</td><td className="p-4 hidden lg:table-cell text-gray-400">{doc.date}</td><td className="p-4 text-right"><div className="flex justify-end gap-2"><button className="p-2 hover:bg-white/10 rounded"><Download size={16} className="text-gray-400"/></button><button className="p-2 hover:bg-red-500/20 rounded"><Trash2 size={16} className="text-gray-400 hover:text-red-400"/></button></div></td></tr>))}
      </tbody></table></div></div>
    </div>
  );
}
