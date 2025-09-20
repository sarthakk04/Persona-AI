"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatbotDetails() {
  const router = useRouter();
  const pathname = usePathname(); // e.g., "/chat/12345"
  const personaId = pathname.split("/").pop(); // get last segment

  const [persona, setPersona] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      router.push("/user/register");
    }

    const fetchPersona = async () => {
      try {
        const res = await fetch(`/api/persona/${personaId}`);
        const data = await res.json();
        setPersona(data.data); // assuming API returns { data: {...} }
      } catch (err) {
        console.error("Error fetching persona:", err);
      }
    };

    if (personaId) fetchPersona();
  }, [personaId, router]);

  if (!persona) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#100044] text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#100044] flex flex-col items-center justify-center text-white p-6 space-y-8">
      <h1 className="text-5xl sm:text-6xl font-extrabold text-[#c87afe] text-center">
        {persona.personaname}
      </h1>
      {persona.description && (
        <p className="text-center text-gray-300 text-lg sm:text-xl max-w-2xl">
          {persona.description}
        </p>
      )}
      <div className="text-center space-y-4">
        <p className="text-white text-2xl sm:text-3xl font-semibold">
          👋 Hello! Are you ready to talk with me?
        </p>
        <p className="text-gray-400">Let’s get started and explore together!</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 rounded-lg border border-gray-500 text-gray-300 hover:bg-black transition"
        >
          ← Back
        </button>
        <button
          onClick={() => router.push(`/chat?personaId=${personaId}`)}
          className="px-6 py-3 rounded-lg bg-[#c87afe] text-black font-semibold hover:bg-[#a94fe8] transition"
        >
          Start Chat →
        </button>
      </div>
    </div>
  );
}
