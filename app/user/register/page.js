"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SpotlightCard from "@/components/SpotlightCard"; // ✅ adjust the import path if needed

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check localStorage only in the browser
    const username = localStorage.getItem("username");

    if (username) {
      // Redirect to dashboard if already registered
      router.replace("/dashboard");
    }
  }, [router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
      localStorage.setItem("username", data.data.username);
      setMessage(`✅ ${data.message}`);
      router.push("/dashboard");
      setUsername("");
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#110046] to-black flex items-center justify-center overflow-hidden">
      {/* Logo in top-left corner */}
      <img
        src="/logo.png"
        alt="Logo"
        className="absolute top-4 left-4 h-22 w-auto"
      />

      {/* Floating bubbles */}
      <div className="absolute w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-16 h-16 bg-[#c87afe]/40 rounded-full animate-floatSlow"></div>
        <div className="absolute top-40 right-12 w-24 h-24 bg-[#c87afe]/30 rounded-full animate-floatMed"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-[#c87afe]/20 rounded-full animate-floatFast"></div>
        <div className="absolute bottom-10 right-32 w-12 h-12 bg-[#c87afe]/25 rounded-full animate-floatSlow"></div>
      </div>

      {/* Spotlight Card with Registration Form */}
      <SpotlightCard
        className="relative z-10 w-full max-w-sm bg-black/90 border border-[#c87afe] rounded-2xl p-8 shadow-lg shadow-[#c87afe]/50"
        spotlightColor="rgba(200, 122, 254, 0.5)"
      >
        <form onSubmit={handleRegister} className="space-y-6">
          <h2
            className="text-3xl font-extrabold text-[#c87afe] text-center"
            style={{ fontFamily: "cardHeading" }}
          >
            Register
          </h2>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg border border-[#c87afe] bg-[#100044] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c87afe]"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#c87afe] text-black font-semibold hover:bg-[#a94fe8] transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {message && (
            <p
              className={`text-center text-sm ${
                message.startsWith("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </SpotlightCard>
    </div>
  );
}
