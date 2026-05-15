import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ShieldCheck,
  Trash2,
  FileText,
  Loader2,
  AlertCircle,
  Download,
} from "lucide-react";

import {
  getMyDocuments,
  verifyDocument,
  downloadDocument,
  deleteDocument,
} from "../api/documents";

export default function MyDocuments() {
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadDocuments = async () => {
    try {
      const data = await getMyDocuments();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage(err.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const filtered = documents.filter((d) =>
    d.original_filename.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusClass = (status) => {
    if (status === "indexed" || status === "processed") {
      return "bg-green-500/20 text-green-400 border-green-500/30";
    }

    if (status === "processing" || status === "uploaded") {
      return "bg-cyber-amber/20 text-cyber-amber border-cyber-amber/30";
    }

    return "bg-red-500/20 text-red-300 border-red-500/30";
  };

  const handleVerify = async (documentId) => {
    setMessage("");
    setVerifyingId(documentId);

    try {
      const result = await verifyDocument(documentId);

      if (result.integrity_valid) {
        setMessage(`Document #${documentId} integrity verified successfully.`);
      } else {
        setMessage(`Document #${documentId} integrity check failed.`);
      }
    } catch (err) {
      setMessage(err.message || "Integrity verification failed");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDownload = async (doc) => {
    try {
      await downloadDocument(doc.id, doc.original_filename);
      setMessage(`Downloaded ${doc.original_filename} successfully.`);
    } catch (err) {
      setMessage(err.message || "Download failed");
    }
  };

  const handleDelete = async (doc) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${doc.original_filename}"?`
    );

    if (!confirmed) return;

    setMessage("");
    setDeletingId(doc.id);

    try {
      await deleteDocument(doc.id);
      setMessage(`Deleted ${doc.original_filename} successfully.`);
      await loadDocuments();
    } catch (err) {
      setMessage(err.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading documents...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Document Vault</h2>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="input-field pl-9 text-sm"
            />
          </div>

          <button className="btn-secondary">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {message && (
        <div className="glass p-3 text-sm text-cyber-cyan flex items-center gap-2">
          <AlertCircle size={16} />
          {message}
        </div>
      )}

      <div className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-800/60 text-gray-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4">Document</th>
                <th className="p-4">Status</th>
                <th className="p-4 hidden md:table-cell">SHA-256</th>
                <th className="p-4 hidden lg:table-cell">Uploaded</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    No documents found.
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/5 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-cyber-cyan/10">
                          <FileText size={18} className="text-cyber-cyan" />
                        </div>

                        <div>
                          <p className="font-medium">{doc.original_filename}</p>

                          <p className="text-xs text-gray-500">
                            {(doc.file_size / 1024 / 1024).toFixed(2)} MB • ID #
                            {doc.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`badge ${getStatusClass(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>

                    <td className="p-4 hidden md:table-cell font-mono text-xs text-gray-400 max-w-[220px] truncate">
                      {doc.sha256_hash}
                    </td>

                    <td className="p-4 hidden lg:table-cell text-gray-400">
                      {new Date(doc.created_at).toLocaleString()}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleVerify(doc.id)}
                          className="p-2 hover:bg-green-500/20 rounded"
                          title="Verify integrity"
                          disabled={verifyingId === doc.id}
                        >
                          {verifyingId === doc.id ? (
                            <Loader2
                              size={16}
                              className="text-green-400 animate-spin"
                            />
                          ) : (
                            <ShieldCheck
                              size={16}
                              className="text-green-400"
                            />
                          )}
                        </button>

                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 hover:bg-cyber-blue/20 rounded"
                          title="Download document"
                        >
                          <Download size={16} className="text-cyber-blue" />
                        </button>

                        <button
                          onClick={() => handleDelete(doc)}
                          className="p-2 hover:bg-red-500/20 rounded"
                          title="Delete document"
                          disabled={deletingId === doc.id}
                        >
                          {deletingId === doc.id ? (
                            <Loader2
                              size={16}
                              className="text-red-400 animate-spin"
                            />
                          ) : (
                            <Trash2
                              size={16}
                              className="text-red-400"
                            />
                          )}
                        </button>
                      </div>
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