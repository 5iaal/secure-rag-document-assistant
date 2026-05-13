import { FileText, MessageSquare, ShieldCheck, TrendingUp } from 'lucide-react';
import { mockStats } from '../lib/mockData';

const Card = ({ icon: Icon, label, value, trend, color }) => (
  <div className="glass glass-hover p-5 flex items-start justify-between">
    <div><p className="text-sm text-gray-400 mb-1">{label}</p><h3 className="text-2xl font-bold">{value}</h3><span className={`text-xs font-medium mt-2 inline-block ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>{trend > 0 ? `â†‘ ${trend}%` : `â†“ ${Math.abs(trend)}%`} this week</span></div>
    <div className={`p-3 rounded-lg ${color} shadow-glow`}><Icon size={20} /></div>
  </div>
);

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><h2 className="text-2xl font-bold">System Overview</h2><button className="btn-secondary">Export Report</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={FileText} label="Total Documents" value={mockStats.docs} trend={12} color="bg-cyber-cyan/20 text-cyber-cyan" />
        <Card icon={MessageSquare} label="AI Queries" value={mockStats.queries} trend={24} color="bg-cyber-blue/20 text-cyber-blue" />
        <Card icon={ShieldCheck} label="Secure Uploads" value={118} trend={8} color="bg-green-500/20 text-green-400" />
        <Card icon={TrendingUp} label="System Health" value={`${mockStats.systemHealth}%`} trend={2} color="bg-cyber-purple/20 text-cyber-purple" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6"><h3 className="text-lg font-semibold mb-4">Recent Activity</h3><div className="space-y-3">
          {['AI generated summary for Security_Policy_2026.pdf', 'User analyst@corp.io uploaded Network_Architecture.pdf', 'Audit log export completed'].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-navy-700/30 border border-white/5"><div className={`w-2 h-2 mt-2 rounded-full ${i%2===0?'bg-cyber-cyan':'bg-cyber-blue'}`}></div><div><p className="text-sm text-gray-200">{item}</p><span className="text-xs text-gray-500">{10 - i*2}h ago</span></div></div>
          ))}
        </div></div>
        <div className="glass p-6"><h3 className="text-lg font-semibold mb-4">Quick Actions</h3><div className="space-y-3">
          <button className="w-full btn-secondary flex items-center justify-between"><span>Upload New PDF</span><FileText size={16}/></button>
          <button className="w-full btn-secondary flex items-center justify-between"><span>Ask AI Assistant</span><MessageSquare size={16}/></button>
          <button className="w-full btn-secondary flex items-center justify-between"><span>Review Logs</span><ShieldCheck size={16}/></button>
        </div></div>
      </div>
    </div>
  );
}
