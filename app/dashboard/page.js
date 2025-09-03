"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [personas, setPersonas] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newPersonaName, setNewPersonaName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      router.push("/user/register"); // 🚨 redirect if not registered
    }
    const fetchPersonas = async () => {
      try {
        const res = await fetch("/api/persona/manual"); // <-- adjust to your API
        const data = await res.json();
        setPersonas(data.data || []);
      } catch (err) {
        console.error("Error fetching personas:", err);
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
        setPersonas((prev) => [...prev, data.data]); // add to list
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
    <div className="p-6 space-y-6">
      {/* Search bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Persona Dashboard</h1>
        <input
          type="text"
          placeholder="Search personas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Create with AI block */}
      <div
        onClick={() => setShowModal(true)}
        className="cursor-pointer border-dashed border-2 border-gray-300 rounded-xl p-6 flex items-center justify-center text-gray-500 hover:bg-gray-50"
      >
        + Create Persona with AI
      </div>

      {/* Persona listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((persona) => (
          <div
            key={persona._id}
            className="border rounded-xl shadow-md p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">
                {persona.personaname}
              </h2>
              <p className="text-gray-600 text-sm">{persona.description}</p>
            </div>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              onClick={() => router.push(`/chat/${persona._id}`)} // 👈 go to details page
            >
              Chat
            </button>
          </div>
        ))}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 space-y-4">
            <h2 className="text-lg font-semibold">Create Persona with AI</h2>
            <input
              type="text"
              placeholder="e.g. Rohit Sharma the batsman"
              value={newPersonaName}
              onChange={(e) => setNewPersonaName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAI}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
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
