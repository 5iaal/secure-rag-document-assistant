import { useState } from 'react';
import { UploadCloud, FileCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function UploadDocument() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState('idle');
  const [progress, setProgress] = useState(0);

  const simulateUpload = () => {
    setUploadState('uploading'); setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(interval); setUploadState('success'); return 100; } return p + 5; });
    }, 50);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Secure Document Upload</h2>
      <div className={`glass p-8 border-2 border-dashed transition-all text-center ${isDragging ? 'border-cyber-cyan bg-cyber-cyan/5' : 'border-white/20'}`}>
        <UploadCloud size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Drag & drop PDFs here</h3>
        <p className="text-gray-500 text-sm mb-6">Max 10MB per file. Encrypted at rest & transit.</p>
        <div className="flex justify-center gap-3"><button onClick={simulateUpload} disabled={uploadState==='uploading'} className="btn-primary">Select File</button></div>
      </div>
      {(uploadState === 'uploading' || uploadState === 'success' || uploadState === 'error') && (
        <div className="glass p-5 space-y-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className={`p-2 rounded ${uploadState==='success'?'bg-green-500/20':'bg-cyber-blue/20'}`}>{uploadState==='uploading' ? <Loader2 className="animate-spin text-cyber-blue"/> : uploadState==='success' ? <FileCheck className="text-green-400"/> : <AlertCircle className="text-red-400"/>}</div><div><p className="font-medium">compliance_report.pdf</p><p className="text-xs text-gray-400">2.4 MB â€¢ AES-256 Encrypted</p></div></div><span className="text-sm font-mono">{progress}%</span></div>
          <div className="h-2 w-full bg-navy-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-blue transition-all duration-300" style={{width: `${progress}%`}}></div></div>
          {uploadState === 'success' && (<div className="p-3 rounded bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2"><FileCheck size={14} /> Integrity verified. Hash: 8f3a...c21d</div>)}
        </div>
      )}
    </div>
  );
}
