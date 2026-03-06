"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "ai/react";
import Loader from "@/components/loader";

export default function ChatPage({ params }) {
  const searchParams = useSearchParams();
  const personaId = searchParams.get("personaId");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [username, setUsername] = useState("");
  const [personaName, setPersonaName] = useState("AI");

  const messagesEndRef = useRef(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } =
    useChat({
      api: conversationId ? `/api/conversations/${conversationId}/messages` : null,
      id: conversationId ?? undefined,
    });

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isLoading]);


  useEffect(() => {
    const startConversation = async () => {
      const storedUser = localStorage.getItem("username");
      if (!storedUser) {
        router.push("/user/register");
        return;
      }
      setUsername(storedUser);

      try {
        // 1️⃣ Create conversation
        const convoRes = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: storedUser, personaId }),
        });
        const convoData = await convoRes.json();
        const convoId = convoData.data;
        setConversationId(convoId);

        // 2️⃣ Fetch existing messages and seed useChat history
        const messagesRes = await fetch(`/api/conversations/${convoId}/messages`);
        const messagesData = await messagesRes.json();
        const existing = (messagesData.data || []).map((m) => ({
          id: m._id,
          role: m.sender === "user" ? "user" : "assistant",
          content: m.content,
        }));
        setMessages(existing);

        // 3️⃣ Fetch persona name
        const personaRes = await fetch(`/api/persona/${personaId}`);
        const personaData = await personaRes.json();
        setPersonaName(personaData?.data?.personaname || "AI");
      } catch (err) {
        console.error("Error starting conversation:", err);
      } finally {
        setLoading(false);
      }
    };

    startConversation();
  }, [personaId, router, setMessages]);

  // 👇 Use your Loader instead of old spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0f002b] via-[#180046] to-[#2a0066]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f002b] via-[#180046] to-[#2a0066] text-white p-6">
      {/* Logo in top-left corner */}
      <img
        src="/logo.png"
        alt="Logo"
        className="absolute top-4 left-4 h-22 w-auto"
      />

      {/* Messages */}
      <div
        className="flex-1 w-full max-w-3xl overflow-y-auto mb-4 space-y-4 
      scrollbar-thin scrollbar-track-transparent 
      scrollbar-thumb-rounded-full scrollbar-thumb-gradient-to-b 
      scrollbar-thumb-from-[#c87afe] scrollbar-thumb-to-[#a94fe8]"
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 italic">
            Start typing to chat with{" "}
            <span className="text-[#c87afe]">{personaName}</span>
          </p>
        ) : (
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id ?? index}
                initial={{ opacity: 0, y: msg.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <span
                  className={`text-xs font-semibold mb-1 ${
                    msg.role === "user" ? "text-[#c87afe]" : "text-green-400"
                  }`}
                >
                  {msg.role === "user" ? username : personaName}
                </span>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className={`p-3 rounded-2xl max-w-xs shadow-md transition-colors duration-300 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#c87afe] to-[#a94fe8] text-white"
                      : "bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-100"
                  }`}
                >
                  {msg.content}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="italic text-gray-400"
          >
            {personaName} is typing...
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form
        onSubmit={(e) => { e.preventDefault(); if (conversationId) handleSubmit(e); }}
        className="flex w-full max-w-3xl flex-col space-y-2"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            disabled={!conversationId || loading || isLoading}
            placeholder="Type your message..."
            className="flex-1 bg-white/10 border border-[#c87afe]/40 
        text-white rounded-2xl px-4 py-3 
        placeholder-gray-400 shadow-inner
        focus:outline-none focus:ring-2 focus:ring-[#c87afe] transition
        disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && conversationId) handleSubmit(e);
            }}
          />
          <motion.button
            type="submit"
            disabled={!conversationId || loading || isLoading || !input?.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 py-3 rounded-2xl font-semibold 
        bg-gradient-to-r from-[#c87afe] to-[#a94fe8] 
        text-white shadow-md hover:shadow-xl transition cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </motion.button>
        </div>
        {/* Detailed note below the chat input */}
        <p className="text-xs text-gray-400 text-center">
          ⚠️ Persona AI is designed to provide helpful responses, but it may
          occasionally make mistakes or provide information that is not fully
          accurate. Please use your own judgment when considering its answers.
        </p>
      </form>
    </div>
  );
}
