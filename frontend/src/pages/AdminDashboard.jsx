import { useEffect, useState } from "react";
import {
  Activity,
  ShieldAlert,
  HardDrive,
  Loader2,
  Users,
  Bot,
} from "lucide-react";

import { apiRequest } from "../api/client";

export default function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [auditData, usersData, statsData] = await Promise.all([
          apiRequest("/audit/events"),
          apiRequest("/auth/admin/users"),
          apiRequest("/auth/admin/stats"),
        ]);

        setLogs(Array.isArray(auditData) ? auditData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setStats(statsData || {});
      } catch (err) {
        console.error("Admin dashboard failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading admin dashboard...
      </div>
    );
  }

  const storageMb = ((stats?.storage_used_bytes || 0) / 1024 / 1024).toFixed(2);

  const bars = days.map((day, index) => {
    const count = logs.filter((log) => {
      const d = new Date(log.created_at);
      return d.getDay() === ((index + 1) % 7);
    }).length;

    return Math.max(10, Math.min(100, count * 20));
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Control Center</h2>

        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs border border-green-500/30">
          System Online
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-cyber-blue/20">
            <Activity size={20} className="text-cyber-blue" />
          </div>

          <div>
            <p className="text-sm text-gray-400">Processed Jobs</p>
            <p className="text-xl font-bold">{stats?.processed_jobs || 0}</p>
          </div>
        </div>

        <div className="glass p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-500/20">
            <ShieldAlert size={20} className="text-red-400" />
          </div>

          <div>
            <p className="text-sm text-gray-400">Failed Logins</p>
            <p className="text-xl font-bold">{stats?.failed_logins || 0}</p>
          </div>
        </div>

        <div className="glass p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-cyber-amber/20">
            <HardDrive size={20} className="text-cyber-amber" />
          </div>

          <div>
            <p className="text-sm text-gray-400">Storage Used</p>
            <p className="text-xl font-bold">{storageMb} MB</p>
          </div>
        </div>

        <div className="glass p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-cyber-teal/20">
            <Bot size={20} className="text-cyber-teal" />
          </div>

          <div>
            <p className="text-sm text-gray-400">AI Queries</p>
            <p className="text-xl font-bold">{stats?.ai_queries || 0}</p>
          </div>
        </div>

        <div className="glass p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-cyber-cyan/20">
            <Users size={20} className="text-cyber-cyan" />
          </div>

          <div>
            <p className="text-sm text-gray-400">Total Users</p>
            <p className="text-xl font-bold">{stats?.total_users || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-4">
          <p className="text-sm text-gray-400">Total Documents</p>
          <p className="text-2xl font-bold mt-1">
            {stats?.total_documents || 0}
          </p>
        </div>

        <div className="glass p-4">
          <p className="text-sm text-gray-400">Indexed Documents</p>
          <p className="text-2xl font-bold mt-1 text-green-400">
            {stats?.indexed_documents || 0}
          </p>
        </div>

        <div className="glass p-4">
          <p className="text-sm text-gray-400">Failed Uploads</p>
          <p className="text-2xl font-bold mt-1 text-red-400">
            {stats?.failed_uploads || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6">
          <h3 className="text-lg font-semibold mb-6">Audit Activity Volume</h3>

          <div className="flex items-end justify-between h-40 gap-2">
            {bars.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full bg-gradient-to-t from-cyber-cyan/50 to-cyber-blue rounded-t transition-all hover:opacity-80"
                  style={{ height: `${h}%` }}
                ></div>

                <span className="text-[10px] text-gray-500">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6">
          <h3 className="text-lg font-semibold mb-4">Security Monitoring</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded bg-navy-700/30 border border-white/5">
              <span className="text-sm text-gray-300">API Gateway</span>
              <span className="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded">
                ACTIVE
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded bg-navy-700/30 border border-white/5">
              <span className="text-sm text-gray-300">Rate Limiting</span>
              <span className="text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 px-2 py-1 rounded">
                ENFORCED
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded bg-navy-700/30 border border-white/5">
              <span className="text-sm text-gray-300">Document Encryption</span>
              <span className="text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 px-2 py-1 rounded">
                FERNET
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded bg-navy-700/30 border border-white/5">
              <span className="text-sm text-gray-300">Audit Events</span>
              <span className="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded">
                {stats?.audit_events || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold">Registered Users</h3>
          <span className="text-xs text-gray-500">{users.length} users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 border-b border-white/10">
              <tr>
                <th className="pb-3">ID</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-3 text-gray-400">#{user.id}</td>

                  <td className="py-3">{user.email}</td>

                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs border ${
                        user.role === "admin"
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : "bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}