import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, FileText, Quote, Loader2 } from "lucide-react";
import { askQuestion } from "../api/rag";

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      content:
        "Secure RAG Assistant initialized. Ask me anything about your uploaded documents.",
      sources: [],
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const question = input.trim();

    if (!question || isTyping) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: question,
      sources: [],
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await askQuestion(question, 4);

      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        content: response.answer || "No answer returned.",
        sources: (response.sources || []).map((src) => ({
          filename: src.filename || "Unknown document",
          chunkIndex: src.chunk_index,
          documentId: src.document_id,
          text: src.text,
        })),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          content: err.message || "Failed to get AI response.",
          sources: [],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "ai",
        content:
          "New secure RAG session started. Ask me about your indexed documents.",
        sources: [],
      },
    ]);
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      <div className="hidden lg:flex flex-col w-64 glass p-4">
        <button
          onClick={startNewChat}
          className="btn-secondary w-full flex items-center gap-2 mb-4"
        >
          <FileText size={16} />
          New Chat
        </button>

        <div className="flex-1 space-y-2 overflow-y-auto">
          {[
            "Ask about uploaded CV",
            "Summarize document",
            "Find security requirements",
          ].map((t, i) => (
            <div
              key={i}
              className={`p-3 rounded cursor-pointer text-sm ${
                i === 0
                  ? "bg-cyber-cyan/10 border border-cyber-cyan/20"
                  : "hover:bg-white/5 border border-transparent"
              }`}
              onClick={() => setInput(t)}
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col glass relative overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-navy-700"
                    : "bg-cyber-cyan/20 text-cyber-cyan"
                }`}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div className="max-w-[80%] space-y-2">
                <div
                  className={`p-4 rounded-xl ${
                    msg.role === "user"
                      ? "bg-navy-700 border border-white/10"
                      : "bg-navy-800/60 border border-cyber-cyan/20"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {msg.content}
                  </p>
                </div>

                {msg.sources.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Sources</p>

                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((src, i) => (
                        <div
                          key={i}
                          className="text-xs px-2 py-1 rounded bg-navy-700 border border-cyber-cyan/30 text-cyber-cyan flex items-center gap-1 max-w-xs"
                          title={src.text}
                        >
                          <Quote size={10} />
                          <span className="truncate">
                            {src.filename} • chunk {src.chunkIndex}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-cyber-cyan/20 text-cyber-cyan flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>

              <div className="p-4 rounded-xl bg-navy-800/60 border border-cyber-cyan/20 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyber-cyan" />
                <span className="text-sm text-gray-400">
                  Retrieving secure context...
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-navy-800/40">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about your secure documents..."
                className="input-field pr-12"
                disabled={isTyping}
              />

              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-cyan hover:text-white transition disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] text-gray-500 mt-2">
            AI may produce inaccurate information. Verify with source documents.
          </p>
        </div>
      </div>
    </div>
  );
}