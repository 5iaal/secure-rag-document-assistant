import { useState } from "react";
import { UploadCloud, FileCheck, AlertCircle, Loader2 } from "lucide-react";
import { uploadDocument } from "../api/documents";

export default function UploadDocument() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;

    setError("");
    setSelectedFile(file);
    setUploadedDoc(null);

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setUploadState("error");
      setError("Only PDF files are allowed.");
      return;
    }

    setUploadState("uploading");
    setProgress(15);

    try {
      const progressTimer = setInterval(() => {
        setProgress((p) => (p < 90 ? p + 10 : p));
      }, 200);

      const result = await uploadDocument(file);

      clearInterval(progressTimer);
      setProgress(100);
      setUploadedDoc(result);
      setUploadState("success");
    } catch (err) {
      setUploadState("error");
      setError(err.message || "Upload failed");
      setProgress(0);
    }
  };

  const handleSelect = (e) => {
    handleFile(e.target.files?.[0]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Secure Document Upload</h2>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`glass p-8 border-2 border-dashed transition-all text-center ${
          isDragging ? "border-cyber-cyan bg-cyber-cyan/5" : "border-white/20"
        }`}
      >
        <UploadCloud size={48} className="mx-auto text-gray-400 mb-4" />

        <h3 className="text-lg font-medium mb-2">Drag & drop PDFs here</h3>

        <p className="text-gray-500 text-sm mb-6">
          Max 10MB per file. Encrypted at rest and verified with SHA-256.
        </p>

        <label className="btn-primary cursor-pointer inline-flex">
          Select File
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={handleSelect}
            disabled={uploadState === "uploading"}
          />
        </label>
      </div>

      {(uploadState === "uploading" ||
        uploadState === "success" ||
        uploadState === "error") && (
        <div className="glass p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded ${
                  uploadState === "success"
                    ? "bg-green-500/20"
                    : uploadState === "error"
                    ? "bg-red-500/20"
                    : "bg-cyber-blue/20"
                }`}
              >
                {uploadState === "uploading" ? (
                  <Loader2 className="animate-spin text-cyber-blue" />
                ) : uploadState === "success" ? (
                  <FileCheck className="text-green-400" />
                ) : (
                  <AlertCircle className="text-red-400" />
                )}
              </div>

              <div>
                <p className="font-medium">
                  {selectedFile?.name || uploadedDoc?.original_filename || "Document"}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedFile
                    ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                    : ""}
                  {" "}• Encrypted Upload
                </p>
              </div>
            </div>

            <span className="text-sm font-mono">{progress}%</span>
          </div>

          <div className="h-2 w-full bg-navy-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-blue transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {uploadState === "success" && uploadedDoc && (
            <div className="p-3 rounded bg-green-500/10 border border-green-500/30 text-green-400 text-sm space-y-1">
              <div className="flex items-center gap-2">
                <FileCheck size={14} />
                Upload successful. Document queued for processing.
              </div>
              <div className="font-mono text-xs text-green-300 break-all">
                SHA-256: {uploadedDoc.sha256_hash}
              </div>
              <div className="text-xs">
                Status: <span className="font-semibold">{uploadedDoc.status}</span>
              </div>
            </div>
          )}

          {uploadState === "error" && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}