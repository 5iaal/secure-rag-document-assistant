import { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  Bot,
  User,
  Plus,
  MessageSquare,
  Loader2,
  Shield,
  Trash2,
} from "lucide-react";
import { askQuestion } from "../api/rag";

const STORAGE_PREFIX = "secrag_chats";

function getUserStorageKey() {
  const userId = sessionStorage.getItem("user_id") || "guest";
  return `${STORAGE_PREFIX}_${userId}`;
}

function extractFilenameFromText(text) {
  const match = text.match(/[\w\u0600-\u06FF\-_. ]+\.pdf/i);
  if (!match) return null;
  return match[0].trim().replace(/^ال/i, "").trim();
}

function createDefaultChat() {
  const id = Date.now();

  return {
    id,
    title: "New secure chat",
    time: "Now",
    activeFile: null,
    messages: [
      {
        id: id + 1,
        role: "ai",
        content:
          "Hi, I’m your secure document assistant. Ask me anything about your uploaded and indexed documents.",
        sources: [],
      },
    ],
  };
}

export default function AIChat() {
  const chatEndRef = useRef(null);

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem(getUserStorageKey());

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return [createDefaultChat()];
      }
    }

    return [createDefaultChat()];
  });

  const [activeChatId, setActiveChatId] = useState(() => chats[0]?.id);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) || chats[0],
    [chats, activeChatId]
  );

  const messages = activeChat?.messages || [];

  useEffect(() => {
    localStorage.setItem(getUserStorageKey(), JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const updateActiveChat = (updater) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId ? updater(chat) : chat
      )
    );
  };

  const cleanAnswer = (text) => {
    if (!text) return "No answer returned.";

    return text
      .replace("I could not find enough information in the uploaded documents.", "")
      .trim();
  };

  const createChatTitle = (question) => {
    if (question.length <= 38) return question;
    return `${question.slice(0, 38)}...`;
  };

  const handleNewChat = () => {
    const newChat = createDefaultChat();

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setInput("");
  };

  const handleDeleteChat = (chatId) => {
    const confirmed = window.confirm("Delete this chat?");
    if (!confirmed) return;

    setChats((prev) => {
      const remaining = prev.filter((chat) => chat.id !== chatId);

      if (remaining.length === 0) {
        const fresh = createDefaultChat();
        setActiveChatId(fresh.id);
        return [fresh];
      }

      if (chatId === activeChatId) {
        setActiveChatId(remaining[0].id);
      }

      return remaining;
    });
  };

  const buildQuestionWithMemory = (question, activeFile) => {
    const questionHasFile = extractFilenameFromText(question);

    if (questionHasFile || !activeFile) {
      return question;
    }

    return `Regarding ${activeFile}, ${question}`;
  };

  const handleSend = async () => {
    const question = input.trim();

    if (!question || isTyping || !activeChat) return;

    const detectedFile = extractFilenameFromText(question);
    const currentActiveFile = detectedFile || activeChat.activeFile;

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: question,
      sources: [],
    };

    updateActiveChat((chat) => ({
      ...chat,
      title: chat.title === "New secure chat" ? createChatTitle(question) : chat.title,
      time: "Now",
      activeFile: currentActiveFile || chat.activeFile,
      messages: [...chat.messages, userMsg],
    }));

    setInput("");
    setIsTyping(true);

    try {
      const questionForBackend = buildQuestionWithMemory(
        question,
        currentActiveFile
      );

      const response = await askQuestion(questionForBackend, 5);

      const cleanedAnswer = cleanAnswer(response.answer);

      const sources = (response.sources || []).map((src, index) => ({
        id: index + 1,
        filename: src.filename || "Unknown document",
        documentId: src.document_id || "N/A",
        chunkIndex: src.chunk_index ?? "N/A",
        relevanceScore: src.relevance_score,
        text: src.text || "",
      }));

      const sourceFile =
        sources.find((src) => src.filename && src.filename !== "Unknown document")
          ?.filename || null;

      const newActiveFile = currentActiveFile || sourceFile;

      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        content:
          cleanedAnswer ||
          "I could not find enough information in the uploaded documents.",
        sources,
      };

      updateActiveChat((chat) => ({
        ...chat,
        activeFile: newActiveFile || chat.activeFile,
        messages: [...chat.messages, aiMsg],
      }));
    } catch (err) {
      updateActiveChat((chat) => ({
        ...chat,
        messages: [
          ...chat.messages,
          {
            id: Date.now() + 1,
            role: "ai",
            content:
              err.message ||
              "Something went wrong while retrieving your secure context.",
            sources: [],
            isError: true,
          },
        ],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const formatRelevance = (score) => {
    if (score === null || score === undefined) return "N/A";
    return Number(score).toFixed(2);
  };

  const MessageBubble = ({ msg }) => {
    const isUser = msg.role === "user";

    return (
      <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isUser
              ? "bg-navy-700 border border-white/10"
              : "bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/20"
          }`}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        <div className={`${isUser ? "max-w-[70%]" : "max-w-[85%]"} space-y-3`}>
          <div
            className={`p-5 rounded-2xl border leading-relaxed ${
              isUser
                ? "bg-navy-700/80 border-white/10"
                : msg.isError
                ? "bg-red-500/10 border-red-500/30"
                : "bg-navy-800/70 border-cyber-cyan/20"
            }`}
          >
            <div className="text-sm whitespace-pre-line text-gray-100">
              {msg.content}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6">
      <div className="hidden xl:flex flex-col w-80 glass p-5">
        <button
          onClick={handleNewChat}
          className="btn-primary w-full flex items-center justify-center gap-2 mb-6"
        >
          <Plus size={18} />
          New Chat
        </button>

        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Recent Chats</h3>
          <span className="text-xs text-gray-500">{chats.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {chats.map((chat) => {
            const active = chat.id === activeChatId;

            return (
              <div
                key={chat.id}
                className={`group p-3 rounded-xl border transition ${
                  active
                    ? "bg-cyber-cyan/10 border-cyber-cyan/40"
                    : "bg-navy-800/30 border-white/5 hover:bg-white/5"
                }`}
              >
                <button
                  onClick={() => setActiveChatId(chat.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare
                      size={16}
                      className={
                        active ? "text-cyber-cyan mt-1" : "text-gray-500 mt-1"
                      }
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {chat.title}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {chat.activeFile
                          ? `File: ${chat.activeFile}`
                          : "No file selected"}
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleDeleteChat(chat.id)}
                  className="mt-2 hidden group-hover:flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col glass overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Shield size={18} className="text-cyber-cyan" />
              AI Assistant
            </h2>

            <p className="text-xs text-gray-500">
              {activeChat?.activeFile
                ? `Current document context: ${activeChat.activeFile}`
                : "Ask questions about your uploaded documents"}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-7">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/20 flex items-center justify-center">
                <Bot size={16} />
              </div>

              <div className="p-4 rounded-2xl bg-navy-800/70 border border-cyber-cyan/20 flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-cyber-cyan" />
                <span className="text-sm text-gray-400">
                  Retrieving secure document context...
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="p-5 border-t border-white/10 bg-navy-900/40">
          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isTyping}
              placeholder={
                activeChat?.activeFile
                  ? `Ask follow-up about ${activeChat.activeFile}...`
                  : "Ask about your secure documents..."
              }
              className="input-field pr-14 h-14 text-base"
            />

            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cyber-cyan hover:text-white disabled:opacity-40 transition"
            >
              {isTyping ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>

          <p className="text-center text-[10px] text-gray-500 mt-2">
            AI may produce inaccurate information. Verify with source documents.
          </p>
        </div>
      </div>
    </div>
  );
}