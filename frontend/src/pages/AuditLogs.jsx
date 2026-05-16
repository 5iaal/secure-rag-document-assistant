import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ShieldCheck,
  XCircle,
  Loader2,
  Fingerprint,
} from "lucide-react";
import { apiRequest } from "../api/client";

export default function AuditLogs() {
  const [filter, setFilter] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await apiRequest("/audit/events");
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load audit logs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const target =
      `${log.action} ${log.user_email} ${log.service_name} ${log.ip_address} ${log.status} ${log.request_id}`
        .toLowerCase();

    return target.includes(filter.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading audit logs...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Audit Trail</h2>
          <p className="text-sm text-gray-500 mt-1">
            Security events, authentication logs, document activity, and AI
            actions.
          </p>
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />

            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search logs, users, request IDs..."
              className="input-field pl-9 text-sm"
            />
          </div>

          <button className="btn-secondary">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-800/60 text-gray-400 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Service</th>
                <th className="p-4">User</th>
                <th className="p-4 hidden md:table-cell">Action</th>
                <th className="p-4 hidden xl:table-cell">Request ID</th>
                <th className="p-4 hidden lg:table-cell">IP Address</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-400">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-white/5 transition"
                  >
                    <td className="p-4 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan text-xs font-medium">
                        {log.service_name}
                      </span>
                    </td>

                    <td className="p-4 text-sm">
                      {log.user_email || `User #${log.user_id || "N/A"}`}
                    </td>

                    <td className="p-4 hidden md:table-cell">
                      <div className="text-gray-100 text-xs font-semibold">
                        {log.action}
                      </div>

                      {log.details && (
                        <div className="text-gray-500 text-[11px] mt-1 max-w-md truncate">
                          {log.details}
                        </div>
                      )}
                    </td>

                    <td className="p-4 hidden xl:table-cell">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                        <Fingerprint size={12} />
                        <span className="max-w-[180px] truncate">
                          {log.request_id || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 hidden lg:table-cell text-gray-500 text-xs font-mono">
                      {log.ip_address || "N/A"}
                    </td>

                    <td className="p-4 text-right">
                      <span
                        className={`badge ${
                          log.status === "success"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}
                      >
                        {log.status === "success" ? (
                          <ShieldCheck size={12} className="inline mr-1" />
                        ) : (
                          <XCircle size={12} className="inline mr-1" />
                        )}

                        {String(log.status).toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}