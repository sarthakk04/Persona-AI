"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react"; // 👈 close icon

export default function Dashboard() {
  const router = useRouter();
  const [personas, setPersonas] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newPersonaName, setNewPersonaName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPersonas, setLoadingPersonas] = useState(true);

  // Animated placeholder
  const placeholders = [
    "Rohit Sharma the batsman",
    "Bill Gates the entrepreneur",
    "Tony Stark the Iron Man",
    "Lata Mangeshkar the Singer",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let interval;

    if (typing) {
      interval = setInterval(() => {
        setDisplayText((prev) => {
          if (prev.length < placeholders[placeholderIndex].length) {
            return placeholders[placeholderIndex].slice(0, prev.length + 1);
          } else {
            clearInterval(interval);
            setTimeout(() => setTyping(false), 1200); // pause
            return prev;
          }
        });
      }, 100);
    } else {
      interval = setInterval(() => {
        setDisplayText((prev) => {
          if (prev.length > 0) {
            return prev.slice(0, -1);
          } else {
            clearInterval(interval);
            setTyping(true);
            setPlaceholderIndex(
              (prevIndex) => (prevIndex + 1) % placeholders.length
            );
            return prev;
          }
        });
      }, 60);
    }

    return () => clearInterval(interval);
  }, [typing, placeholderIndex]);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      router.push("/user/register");
    }

    const fetchPersonas = async () => {
      try {
        setLoadingPersonas(true);
        const res = await fetch("/api/persona/manual");
        const data = await res.json();

        // Newest first
        setPersonas((data.data || []).reverse());
      } catch (err) {
        console.error("Error fetching personas:", err);
      } finally {
        setLoadingPersonas(false);
      }
    };

    fetchPersonas();
  }, [router]);

  const filtered = personas.filter((p) =>
    p.personaname?.toLowerCase().includes(search.toLowerCase())
  );

  // Handling AI Creation Persona
  const handleCreateAI = async () => {
    if (!newPersonaName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/persona/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: newPersonaName }),
      });

      const data = await res.json();

      if (data?.data) {
        // Add to top
        setPersonas((prev) => [data.data, ...prev]);
        setNewPersonaName("");
        setShowModal(false);
      } else {
        console.error("Error creating AI persona:", data);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#100044] text-white p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-extrabold tracking-wide">
          Persona Dashboard
        </h1>
        <input
          type="text"
          placeholder="🔍 Search personas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-[#c87afe] bg-black text-white rounded-lg px-4 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[#c87afe]"
        />
      </div>

      {/* Create with AI block */}
      <div
        onClick={() => setShowModal(true)}
        className="cursor-pointer border-2 border-dashed border-[#c87afe] rounded-xl p-8 text-center text-[#c87afe] hover:bg-black hover:text-white transition"
      >
        + Create Persona with AI
      </div>

      {/* Persona listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingPersonas ? (
          // Skeletons
          Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse border border-[#c87afe]/30 rounded-xl p-4 bg-black"
              >
                <div className="h-6 w-2/3 bg-[#c87afe]/30 rounded mb-3"></div>
                <div className="h-4 w-full bg-[#c87afe]/20 rounded mb-2"></div>
                <div className="h-4 w-4/5 bg-[#c87afe]/20 rounded"></div>
              </div>
            ))
        ) : filtered.length > 0 ? (
          filtered.map((persona) => (
            <div
              key={persona._id}
              className="border border-[#c87afe] rounded-xl shadow-lg p-6 flex flex-col justify-between bg-black hover:shadow-[#c87afe]/40 transition"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2 text-[#c87afe]">
                  {persona.personaname}
                </h2>
                <p className="text-gray-300 text-sm">{persona.description}</p>
              </div>
              <button
                className="mt-4 bg-[#c87afe] hover:bg-[#a94fe8] text-black font-semibold px-4 py-2 rounded-lg transition"
                onClick={() => router.push(`/chat/${persona._id}`)}
              >
                Chat
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No personas found.
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="relative bg-[#100044] border border-[#c87afe] rounded-xl p-6 w-96 space-y-4 shadow-lg shadow-[#c87afe]/30">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-semibold text-[#c87afe]">
              Create Persona with AI
            </h2>
            <input
              type="text"
              placeholder={displayText}
              value={newPersonaName}
              onChange={(e) => setNewPersonaName(e.target.value)}
              className="border border-[#c87afe] bg-black text-white rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#c87afe]"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-500 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAI}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#c87afe] text-black font-semibold hover:bg-[#a94fe8] disabled:opacity-50"
              >
                {loading ? "Creating..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
