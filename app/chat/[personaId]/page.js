"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

export default function ChatbotDetails({ params }) {
  const router = useRouter();

  const { personaId } = use(params); // 👈 get id from URL
  const [persona, setPersona] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      router.push("/user/register"); // 🚨 redirect if not registered
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

    fetchPersona();
  }, [personaId, router]);

  if (!persona) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">{persona.personaname}</h1>
      <p className="text-gray-700">{persona.description}</p>

      {/* extra details if available */}
      {persona.promptDef && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">System Prompt</h2>
          <p className="text-gray-600 text-sm whitespace-pre-wrap">
            {persona.promptDef.systemPrompt}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          ← Back
        </button>
        <button
          onClick={() => router.push(`/chat?personaId=${personaId}`)} // 👈 proceed to chat page
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Proceed →
        </button>
      </div>
    </div>
  );
}
