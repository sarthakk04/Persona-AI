"use client";

import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

// Lazy-load Spline (client-only)
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

export default function Home() {
  const letters = "PERSONA".split("");
  const { ref, inView } = useInView({ triggerOnce: true });
  const [loadSpline, setLoadSpline] = useState(false);

  useEffect(() => {
    if (inView) {
      setLoadSpline(true);
    }
  }, [inView]);

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Background Spline */}
      <div ref={ref} className="absolute inset-0">
        {loadSpline && (
          <Spline
            scene="https://prod.spline.design/aXIekA1i-0MYrNdj/scene.splinecode"
            onLoad={(splineApp) => {
              if (!splineApp) return;

              // Disable user controls
              if (splineApp.controls) {
                splineApp.controls.enableZoom = false;
                splineApp.controls.enableRotate = false;
                splineApp.controls.enablePan = false;
              }

              // Try to get camera safely
              const camera = splineApp.camera || splineApp.scene?.activeCamera;
              if (camera) {
                // Lock camera position & angle
                camera.position.set(12, 52, 28);
                camera.lookAt(0, 0, 0);

                camera.updateProjectionMatrix?.();
              } else {
                console.warn("Camera not found in Spline app");
              }
            }}
          />
        )}
      </div>

      {/* Floating comment dialog boxes */}
      <div className="absolute inset-0 pointer-events-none text-sm sm:text-base md:text-lg">
        {/* Left side */}
        <div className="absolute left-2 sm:left-4 bottom-16 sm:bottom-20 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-[#e9bcf6] text-black shadow-lg animate-floatSlow max-w-[60%] sm:max-w-[40%]">
          💜 Welcome to Persona
        </div>
        <div className="absolute left-3 sm:left-6 bottom-28 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-[#e9bcf6] text-black shadow-lg animate-floatSlow max-w-[60%] sm:max-w-[40%]">
          💜 Let’s have a chat with anyone
        </div>
        <div className="absolute left-4 sm:left-5 bottom-52 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-[#e9bcf6] text-black shadow-lg animate-floatMed max-w-[60%] sm:max-w-[40%]">
          🌌 Talk to you idols
        </div>

        {/* Right side */}
        <div className="absolute right-4 sm:right-6 bottom-32 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-[#e9bcf6] text-black shadow-lg animate-floatFast max-w-[60%] sm:max-w-[40%] text-right">
          🔮 Try interacting!
        </div>
        <div className="absolute right-4 sm:right-6 bottom-60 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-[#e9bcf6] text-black shadow-lg animate-floatMed max-w-[60%] sm:max-w-[40%] text-right">
          💖 Hey I am Ronaldo
        </div>
      </div>

      {/* Top-right Button */}
      <button
        className="absolute top-4 sm:top-6 right-4 sm:right-6 px-5 sm:px-8 py-2 sm:py-3 
        bg-gradient-to-r from-[#b849f7] to-[#c87afe] 
        text-white font-bold text-sm sm:text-lg rounded-full shadow-lg
        hover:scale-105 transition-transform duration-300 z-20"
      >
        Get Started
      </button>

      {/* Bottom Text (interactive letters) */}
      <div
        className="absolute bottom-0 w-full text-center flex justify-center 
        space-x-[0.05em] sm:space-x-[0.1em] 
        text-[60px] sm:text-[120px] md:text-[180px] lg:text-[200px]
        font-extrabold tracking-widest sm:bottom-10 
        bg-gradient-to-b from-[#100044] via-[#b849f7] to-[#c87afe] 
        bg-clip-text text-transparent
        drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)] sm:drop-shadow-[0_5px_10px_rgba(0,0,0,0.7)]
        leading-none z-20"
      >
        {letters.map((char, i) => (
          <span
            key={i}
            className="transition-all duration-300 ease-in-out 
            hover:scale-110 hover:drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]"
          >
            {char}
          </span>
        ))}
      </div>
    </main>
  );
}
