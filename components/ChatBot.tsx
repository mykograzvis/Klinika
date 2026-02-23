"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Tavo .NET backend URL (pakeisk port’ą)
      const res = await fetch("https://localhost:7237/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const aiMessage: Message = { role: "assistant", content: data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMsg: Message = { 
        role: "assistant", 
        content: "Klaida jungiantis prie AI. Patikrink, ar LM Studio serveris paleistas localhost:1234." 
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🦷 Klinikos asistentas</h2>
        <p className="text-gray-600">Paklauskite apie laisvus laikus, gydytojus ar rezervacijas</p>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6 shadow-xl">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <p>Parašykite žinutę ir pradėkime!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end mb-4" : "justify-start mb-4"}`}>
              <div className={`max-w-xs lg:max-w-md p-4 rounded-2xl shadow-md ${
                msg.role === "user" 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" 
                  : "bg-gray-100 border"
              }`}>
                <p>{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="p-4 bg-gray-100 border rounded-2xl animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-48"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 p-4 bg-white border-2 border-gray-200 rounded-2xl shadow-lg">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          className="flex-1 p-4 border-none outline-none text-lg placeholder-gray-500 resize-none"
          placeholder="Pvz: kokie laikai laisvi pas Sandrą higienai..."
          disabled={loading}
          maxLength={500}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "Siųsti"}
        </button>
      </div>

      <div className="text-xs text-gray-500 text-center mt-4">
        AI veikia per vietinį Llama modelį • LM Studio localhost:1234
      </div>
    </div>
  );
}
