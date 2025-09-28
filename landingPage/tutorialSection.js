"use client";
import React from "react";
import { Play } from "lucide-react";

export default function TutorialSection() {
  return (
    <section className="relative px-6 py-20 bg-gradient-to-br from-black via-[#110046] to-black">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2
          className="text-4xl md:text-5xl font-bold text-white mb-6"
          style={{ fontFamily: "cardHeading" }}
        >
          Learn how to use{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Persona AI
          </span>
        </h2>
        <p
          className="text-xl text-purple-200 mb-12 max-w-2xl mx-auto"
          style={{ fontFamily: "cardDesc" }}
        >
          Watch this short tutorial to get started with our AI companions and
          explore the features built just for you.
        </p>

        {/* Video Container */}
        <div className="relative group max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
          {/* Shining Border */}
          <div className="absolute -inset-0.5 rounded-3xl p-[2px] bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-border-shine">
            <div className="h-full w-full rounded-3xl bg-gradient-to-br from-[#170552]/80 to-[#48237c]/60 backdrop-blur-sm"></div>
          </div>

          {/* Video Embed */}
          <div className="relative aspect-video rounded-3xl overflow-hidden">
            <iframe
              className="w-full h-full rounded-3xl"
              src="https://www.youtube.com/embed/_zQeCyoUZbg"
              title="Persona AI Tutorial"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>

            {/* Overlay Play button (optional if not autoplay) */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500">
              <button className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:scale-110 transform transition">
                <Play className="w-10 h-10 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
