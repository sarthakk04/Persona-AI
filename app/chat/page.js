"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function ChatPage({ params }) {
  const searchParams = useSearchParams();
  const personaId = searchParams.get("personaId");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    "Collecting things for you..."
  );
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const loaderMessages = [
    "Collecting things for you...",
    "Building the persona...",
    "Almost ready...",
  ];

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, aiTyping]);

  useEffect(() => {
    const startConversation = async () => {
      const username = localStorage.getItem("username");
      if (!username) {
        router.push("/user/register");
        return;
      }

      let i = 0;
      const loaderInterval = setInterval(() => {
        setLoadingMessage(loaderMessages[i % loaderMessages.length]);
        i++;
      }, 2000);

      try {
        // 1️⃣ Create conversation
        const convoRes = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, personaId }),
        });
        const convoData = await convoRes.json();
        const convoId = convoData.data;
        setConversationId(convoId);

        // 2️⃣ Fetch existing messages
        const messagesRes = await fetch(
          `/api/conversations/${convoId}/messages`
        );
        const messagesData = await messagesRes.json();
        setMessages(messagesData.data || []);
      } catch (err) {
        console.error("Error starting conversation:", err);
      } finally {
        clearInterval(loaderInterval);
        setLoading(false);
      }
    };

    startConversation();
  }, [personaId, router]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !conversationId) return;

    // 1️⃣ Add user message
    const newMessage = { sender: "user", content: userInput };

    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setAiTyping(true);

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!res.body) throw new Error("Streaming not supported");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // 2️⃣ Initialize AI message in state
      setMessages((prev) => [...prev, { sender: "ai", content: "" }]);
      let gotAnyChunk = false;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (chunk) gotAnyChunk = true;

        // 3️⃣ Append chunk to last AI message
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content += chunk;
          return newMessages;
        });
      }
      if (!gotAnyChunk) {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content =
            "⚠️ Failed to get AI response";
          return newMessages;
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setAiTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen flex-col text-gray-400 bg-[#100044]">
        <div className="loader mb-4"></div>
        <p>{loadingMessage}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto flex flex-col h-screen bg-[#100044] text-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 scrollbar-thin scrollbar-thumb-[#c87afe]/60 scrollbar-track-transparent">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <span
              className={`text-xs font-semibold mb-1 ${
                msg.sender === "user" ? "text-[#c87afe]" : "text-gray-400"
              }`}
            >
              {msg.sender === "user" ? "You" : "AI"}
            </span>
            <div
              className={`p-3 rounded-2xl max-w-xs shadow-md transition-all duration-200 hover:scale-[1.02] ${
                msg.sender === "user"
                  ? "bg-[#c87afe] text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {aiTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="italic text-gray-400"
          >
            AI is typing...
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-700 bg-gray-900 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c87afe] transition"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSendMessage}
          className="px-5 py-2 bg-[#c87afe] text-white rounded-lg shadow-md hover:bg-[#b55ef0] transition"
        >
          Send
        </motion.button>
      </div>
    </div>
  );
}
