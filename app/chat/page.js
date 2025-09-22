"use client";

import { Suspense } from "react";
import ChatPage from "@/components/ChatPage"; // move your component here

export default function Chat() {
  return (
    <Suspense fallback={<div className="text-white p-6">Loading chat...</div>}>
      <ChatPage />
    </Suspense>
  );
}
