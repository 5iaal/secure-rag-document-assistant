import { useLocation, Link } from 'react-router-dom';
import { Shield, LayoutDashboard, UploadCloud, FileText, MessageSquare, ClipboardList, Settings, ShieldCheck, X, ChevronRight } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, section: 'General' },
  { label: 'Upload', path: '/upload', icon: UploadCloud },
  { label: 'Documents', path: '/documents', icon: FileText },
  { label: 'AI Assistant', path: '/ai-chat', icon: MessageSquare },
  { label: 'Audit Logs', path: '/audit-logs', icon: ClipboardList, section: 'Admin' },
  { label: 'System Admin', path: '/admin', icon: ShieldCheck },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, toggle }) {
  const location = useLocation();
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass border-r border-white/10 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-cyber-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]" />
          <h1 className="text-lg font-bold tracking-wide">SEC<span className="text-cyber-cyan">RAG</span></h1>
        </div>
        <button onClick={toggle} className="lg:hidden text-gray-400 hover:text-white"><X size={20} /></button>
      </div>
      <nav className="p-4 space-y-8 overflow-y-auto h-[calc(100vh-76px)]">
        {navItems.reduce((acc, item, idx, arr) => {
          const prevSection = idx > 0 ? arr[idx-1].section : null;
          if (item.section && item.section !== prevSection) {
            acc.push(<div key={`sec-${item.section}`} className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.section}</div>);
          }
          const isActive = location.pathname === item.path;
          acc.push(
            <Link key={item.path} to={item.path} onClick={() => window.innerWidth < 1024 && toggle()}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${isActive ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 shadow-glow-hover' : 'text-gray-400 hover:bg-navy-700/50 hover:text-white'}`}>
                <item.icon size={18} className={isActive ? 'text-cyber-cyan' : ''} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto opacity-70" />}
              </div>
            </Link>
          );
          return acc;
        }, [])}
      </nav>
    </aside>
  );
}
