import { useEffect, useState } from "react";
import {
  Activity,
  ShieldAlert,
  HardDrive,
  Network,
  Loader2,
} from "lucide-react";
import { apiRequest } from "../api/client";
import { getMyDocuments } from "../api/documents";

export default function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [auditData, docsData] = await Promise.all([
          apiRequest("/audit/events"),
          getMyDocuments(),
        ]);

        setLogs(Array.isArray(auditData) ? auditData : []);
        setDocuments(Array.isArray(docsData) ? docsData : []);
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

  const processedJobs = documents.filter((doc) =>
    ["processed", "indexed"].includes(doc.status)
  ).length;

  const failedLogins = logs.filter((log) => log.action === "LOGIN_FAILED").length;

  const aiQueries = logs.filter((log) =>
    String(log.action || "").includes("RAG")
  ).length;

  const storageBytes = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
  const storageMb = (storageBytes / 1024 / 1024).toFixed(2);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-cyber-blue/20">
            <Activity size={20} className="text-cyber-blue" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Processed Jobs</p>
            <p className="text-xl font-bold">{processedJobs}</p>
          </div>
        </div>

        <div className="glass p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-500/20">
            <ShieldAlert size={20} className="text-red-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Failed Logins</p>
            <p className="text-xl font-bold">{failedLogins}</p>
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
            <Network size={20} className="text-cyber-teal" />
          </div>
          <div>
            <p className="text-sm text-gray-400">AI Queries</p>
            <p className="text-xl font-bold">{aiQueries}</p>
          </div>
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
                {logs.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}