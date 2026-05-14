import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { getMyDocuments } from "../api/documents";
import { apiRequest } from "../api/client";

const Card = ({ icon: Icon, label, value, trend, color }) => (
  <div className="glass glass-hover p-5 flex items-start justify-between">
    <div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
      <span
        className={`text-xs font-medium mt-2 inline-block ${
          trend >= 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        {trend >= 0 ? `↑ ${trend}%` : `↓ ${Math.abs(trend)}%`} this week
      </span>
    </div>
    <div className={`p-3 rounded-lg ${color} shadow-glow`}>
      <Icon size={20} />
    </div>
  </div>
);

export default function UserDashboard() {
  const [documents, setDocuments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("user_role");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const docs = await getMyDocuments();
        setDocuments(Array.isArray(docs) ? docs : []);

        if (role === "admin") {
          const logs = await apiRequest("/audit/events");
          setAuditLogs(Array.isArray(logs) ? logs : []);
        }
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [role]);

  const totalDocs = documents.length;
  const indexedDocs = documents.filter((d) => d.status === "indexed").length;
  const secureUploads = documents.filter((d) =>
    ["uploaded", "processed", "indexed"].includes(d.status)
  ).length;

  const aiQueries = auditLogs.filter((log) =>
    String(log.action || "").includes("RAG")
  ).length;

  const recentActivity =
    role === "admin"
      ? auditLogs.slice(0, 5).map((log) => ({
          text: `${log.service_name} • ${log.action} • ${log.status}`,
          time: new Date(log.created_at).toLocaleString(),
        }))
      : documents.slice(0, 5).map((doc) => ({
          text: `${doc.original_filename} uploaded • status: ${doc.status}`,
          time: new Date(doc.created_at).toLocaleString(),
        }));

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">System Overview</h2>
        <button className="btn-secondary">Export Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          icon={FileText}
          label="Total Documents"
          value={totalDocs}
          trend={12}
          color="bg-cyber-cyan/20 text-cyber-cyan"
        />

        <Card
          icon={MessageSquare}
          label="AI Queries"
          value={aiQueries}
          trend={24}
          color="bg-cyber-blue/20 text-cyber-blue"
        />

        <Card
          icon={ShieldCheck}
          label="Secure Uploads"
          value={secureUploads}
          trend={8}
          color="bg-green-500/20 text-green-400"
        />

        <Card
          icon={TrendingUp}
          label="Indexed Docs"
          value={indexedDocs}
          trend={2}
          color="bg-cyber-purple/20 text-cyber-purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-400">No recent activity yet.</p>
            ) : (
              recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-navy-700/30 border border-white/5"
                >
                  <div
                    className={`w-2 h-2 mt-2 rounded-full ${
                      i % 2 === 0 ? "bg-cyber-cyan" : "bg-cyber-blue"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm text-gray-200">{item.text}</p>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

          <div className="space-y-3">
            <Link
              to="/upload"
              className="w-full btn-secondary flex items-center justify-between"
            >
              <span>Upload New PDF</span>
              <FileText size={16} />
            </Link>

            <Link
              to="/ai-chat"
              className="w-full btn-secondary flex items-center justify-between"
            >
              <span>Ask AI Assistant</span>
              <MessageSquare size={16} />
            </Link>

            {role === "admin" && (
              <Link
                to="/audit-logs"
                className="w-full btn-secondary flex items-center justify-between"
              >
                <span>Review Logs</span>
                <ShieldCheck size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}