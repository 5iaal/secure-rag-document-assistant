import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, FileText, Quote } from 'lucide-react';

export default function AIChat() {
  const [messages, setMessages] = useState([{ id: 1, role: 'ai', content: 'Secure RAG Assistant initialized. Ask me anything about your uploaded documents.', sources: [] }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', content: input, sources: [] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now()+1, role: 'ai', content: 'Based on the Security Policy PDF, multi-factor authentication is mandatory for all administrative access. Zero-trust architecture principles apply to internal network segments.', sources: ['Security_Policy_2026.pdf (Sec 3.2)', 'Network_Architecture.pdf (Fig 4)'] }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      <div className="hidden lg:flex flex-col w-64 glass p-4"><button className="btn-secondary w-full flex items-center gap-2 mb-4"><FileText size={16}/> New Chat</button><div className="flex-1 space-y-2 overflow-y-auto">{['RAG Query: Auth Policy', 'Summarize Q2 Report', 'Network Segments'].map((t, i) => (<div key={i} className={`p-3 rounded cursor-pointer text-sm ${i===2 ? 'bg-cyber-cyan/10 border border-cyber-cyan/20' : 'hover:bg-white/5 border border-transparent'}`}>{t}</div>))}</div></div>
      <div className="flex-1 flex flex-col glass relative overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {messages.map(msg => (<div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}><div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-navy-700' : 'bg-cyber-cyan/20 text-cyber-cyan'}`}>{msg.role === 'user' ? <User size={16}/> : <Bot size={16}/>}</div><div className={`max-w-[80%] space-y-2`}><div className={`p-4 rounded-xl ${msg.role === 'user' ? 'bg-navy-700 border border-white/10' : 'bg-navy-800/60 border border-cyber-cyan/20'}`}><p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p></div>{msg.sources.length > 0 && (<div className="flex flex-wrap gap-2">{msg.sources.map((src, i) => (<span key={i} className="text-xs px-2 py-1 rounded bg-navy-700 border border-cyber-cyan/30 text-cyber-cyan flex items-center gap-1"><Quote size={10}/> {src}</span>))}</div>)}</div></div>))}
          {isTyping && (<div className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-cyber-cyan/20 text-cyber-cyan flex items-center justify-center shrink-0"><Bot size={16}/></div><div className="p-4 rounded-xl bg-navy-800/60 border border-cyber-cyan/20 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce delay-100"></div><div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce delay-200"></div></div></div>)}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t border-white/10 bg-navy-800/40"><div className="flex items-end gap-3 max-w-4xl mx-auto"><div className="flex-1 relative"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSend()} placeholder="Ask about your secure documents..." className="input-field pr-12" /><button onClick={handleSend} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-cyan hover:text-white transition"><Send size={18}/></button></div></div><p className="text-center text-[10px] text-gray-500 mt-2">AI may produce inaccurate information. Verify with source documents.</p></div>
      </div>
    </div>
  );
}
