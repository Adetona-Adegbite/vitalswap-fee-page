import React, { useEffect, useRef, useState } from "react";
import { FiMessageCircle, FiX, FiSend, FiSettings } from "react-icons/fi";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";
const MAX_CONTEXT_CHARS = 3500;

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export default function PageCopilot() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const capturePageSnapshot = (): string => {
    try {
      const text = document.body.innerText || "";
      return text.replace(/\s+/g, " ").trim().slice(0, MAX_CONTEXT_CHARS);
    } catch {
      return "";
    }
  };

  const buildPrompt = (question: string, pageSnapshot: string): string => {
    return [
      "You are a helpful AI copilot for VitalSwap — a USD/NGN exchange rate and calculator tool.",
      "Answer concisely, clearly, and reference only what's visible on the current page.",
      "If you don't know, say so and suggest checking the UI.",
      "",
      "--- PAGE CONTEXT START ---",
      pageSnapshot || "(No page content captured)",
      "--- PAGE CONTEXT END ---",
      "",
      `USER: ${question}`,
      "",
      "ASSISTANT:",
    ].join("\n");
  };

  const sendToGemini = async (prompt: string) => {
    setError(null);
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": API_KEY,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "No response from AI.";

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, timestamp: Date.now() },
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to connect to Gemini.");
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const onSend = () => {
    const q = query.trim();
    if (!q || loading) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: q, timestamp: Date.now() },
    ]);

    const snapshot = capturePageSnapshot();
    const prompt = buildPrompt(q, snapshot);

    setQuery("");
    sendToGemini(prompt);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {/* Floating Trigger */}
      <div className="fixed left-4 bottom-6 z-50">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Page Copilot (Ctrl+K)"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl flex items-center justify-center ring-4 ring-white/30 transition-all hover:scale-110"
        >
          <FiMessageCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Page Copilot"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-2xl h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-black/10 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                  <FiMessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Page Copilot
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ask about rates, fees, or anything on this page
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* <button
                  onClick={() => {
                    const key = prompt(
                      "Enter your Gemini API key (stored in session):"
                    );
                    if (key?.trim()) {
                      sessionStorage.setItem(
                        "vitalswap_gemini_key",
                        key.trim()
                      );
                      alert("Key saved for this session!");
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-600 dark:text-slate-300"
                  title="Set API Key"
                >
                  <FiSettings className="w-4 h-4" />
                </button> */}
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-600 dark:text-slate-300"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.length === 0 && !loading && !error && (
                <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
                  <p>Ask anything about the page — rates, calculator, or UI.</p>
                  <p className="mt-1 text-xs">Powered by Gemini 1.5 Flash</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-slate-800 dark:text-slate-100"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.role === "user"
                          ? "text-blue-200"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl shadow-sm">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSend();
                    }
                  }}
                  placeholder="Ask about exchange rates, fees, or how to use the calculator..."
                  className="flex-1 min-h-[56px] max-h-32 resize-none rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  rows={1}
                />

                <div className="flex flex-col gap-2">
                  <button
                    onClick={onSend}
                    disabled={loading || !query.trim()}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      loading || !query.trim()
                        ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                        : "bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <FiSend className="w-5 h-5" />
                    )}
                  </button>

                  {messages.length > 0 && (
                    <button
                      onClick={clearChat}
                      className="w-12 h-8 text-xs rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-slate-600 dark:text-slate-300"
                      title="Clear chat"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
                Press{" "}
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                  Enter
                </kbd>{" "}
                to send •{" "}
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                  Shift+Enter
                </kbd>{" "}
                for new line
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
