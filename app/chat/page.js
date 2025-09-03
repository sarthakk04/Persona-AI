"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

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
    const username = localStorage.getItem("username");
    if (!username) {
      router.push("/user/register"); // 🚨 redirect if not registered
    }
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

        // 2️⃣ Send initial "Hello!" message
        await fetch(`/api/conversations/${convoId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: "user", content: "Hello!" }),
        });

        // 3️⃣ Fetch existing messages
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // 3️⃣ Append chunk to last AI message
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content += chunk;
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
      <div className="flex items-center justify-center h-screen flex-col text-gray-600">
        <div className="loader mb-4"></div>
        <p>{loadingMessage}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto flex flex-col h-screen">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-xs ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {aiTyping && (
          <div className="italic text-gray-500">AI is typing...</div>
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
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
