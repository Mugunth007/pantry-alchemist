"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ChefHat } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState([{ role: "agent", text: "Hello! I am your Pantry Alchemist. Tell me what you bought today or ask for a recipe!" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/signin");
    }
  }, [status]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: "agent", text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "agent", text: "Sorry, I ran into an error." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "agent", text: "Network error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-24 pb-8 px-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl flex-1 flex flex-col bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-black/20">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <ChefHat className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="font-semibold text-white">Pantry Alchemist</h1>
            <p className="text-xs text-neutral-400">Gemini 3 + MongoDB Vector Search</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-neutral-800" : "bg-blue-600/20 border border-blue-500/30"}`}>
                {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-blue-400" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${msg.role === "user" ? "bg-neutral-800 text-white" : "bg-neutral-950/80 border border-white/5 text-neutral-200"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-neutral-950/80 border border-white/5 text-neutral-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-.3s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-.5s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/20 border-t border-white/5">
          <form onSubmit={sendMessage} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about recipes or update your inventory..."
              className="w-full bg-neutral-950 border border-white/10 rounded-full pl-6 pr-14 py-3.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-full transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
