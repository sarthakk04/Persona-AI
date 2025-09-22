"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";
import { useRouter } from "next/navigation";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  backgroundImage = "/image.jpg",
  ...props
}) => {
  const router = useRouter();

  return (
    <main
      className={cn("relative w-full h-screen overflow-hidden", className)}
      {...props}
    >
      {/* Background Image (Desktop only) */}
      <div
        className="hidden md:block absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})`, zIndex: 0 }}
      />

      {/* Mobile black background */}
      <div
        className="block md:hidden absolute inset-0 bg-black"
        style={{ zIndex: 0 }}
      />

      {/* Aurora Background */}
      <div
        className={cn(
          "transition-bg relative flex h-full flex-col items-center justify-center text-white",
          className
        )}
        style={{ zIndex: 1 }}
      >
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none" // ✅ won't block clicks
          style={{
            "--aurora":
              "repeating-linear-gradient(100deg,#592295_10%,#c064fb_15%,#592295_20%,#c064fb_25%,#592295_30%)",
            "--dark-gradient":
              "repeating-linear-gradient(100deg,#1a0033_0%,#1a0033_7%,transparent_10%,transparent_12%,#1a0033_16%)",
            "--white-gradient":
              "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",
            "--cyan-bright": "#6404caff",
            "--cyan-blue": "#9c16f0ff",
            "--teal-dark": "#520380ff",
            "--black": "#1f003cff",
            "--white": "#fff",
            "--transparent": "transparent",
            zIndex: 1,
          }}
        >
          <div
            className={cn(
              `aurora-element pointer-events-none absolute -inset-[10px] [background-image:var(--dark-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-70 blur-[10px] will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--cyan-bright)_10%,var(--cyan-blue)_15%,var(--teal-dark)_20%,var(--cyan-bright)_25%,var(--cyan-blue)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[""]`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>

        {/* Top-right button (desktop only) */}
        <button
          onClick={() => router.push("/user/register")}
          className="cursor-pointer hidden md:block absolute top-6 right-6 px-8 py-3 bg-gradient-to-r from-[#b849f7] to-[#c87afe] text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          style={{ zIndex: 50 }} // ✅ ensures it's on top
        >
          Get Started
        </button>

        {/* Persona Text */}
        <div className="flex flex-col items-center justify-center w-full h-full text-center relative z-10">
          {/* Desktop: bottom position */}
          <div className="hidden md:block absolute bottom-0 w-full flex justify-center">
            <span className="text-[150px] lg:text-[200px] font-extrabold tracking-widest bg-gradient-to-b from-[#100044] via-[#b849f7] to-[#c87afe] bg-clip-text text-transparent drop-shadow-[0_5px_10px_rgba(0,0,0,0.7)] leading-none">
              PERSONA AI
            </span>
          </div>

          {/* Mobile: center position */}
          <div className="flex flex-col items-center justify-center md:hidden space-y-6">
            <span className="text-[65px] sm:text-[110px] font-extrabold tracking-widest bg-gradient-to-b from-[#100044] via-[#b849f7] to-[#c87afe] bg-clip-text text-transparent drop-shadow-[0_5px_10px_rgba(0,0,0,0.7)] leading-none">
              PERSONA AI
            </span>

            {/* Tagline */}
            <p className="mt-4 text-white text-lg sm:text-2xl text-center max-w-[280px] sm:max-w-[350px]">
              💬 Talk with anyone you want — chat, share, and connect instantly
              with anyone, anywhere.
            </p>

            {/* Mobile button */}
            <button
              onClick={() => router.push("/user/register")}
              style={{ fontFamily: "cardDesc" }}
              className="px-8 py-3 bg-gradient-to-r from-[#b849f7] to-[#c87afe] text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transition-transform duration-300 mt-4"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes aurora {
          0% {
            background-position:
              0% 0%,
              50% 50%;
          }
          50% {
            background-position:
              100% 100%,
              0% 50%;
          }
          100% {
            background-position:
              0% 0%,
              50% 50%;
          }
        }
        .aurora-element {
          animation: aurora 60s linear infinite;
        }
        .aurora-element::after {
          animation: aurora 60s linear infinite reverse;
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }
        @keyframes floatMed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-2deg);
          }
        }
        @keyframes floatFast {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(1deg);
          }
        }

        .animate-floatSlow {
          animation: floatSlow 4s ease-in-out infinite;
        }
        .animate-floatMed {
          animation: floatMed 3.5s ease-in-out infinite;
        }
        .animate-floatFast {
          animation: floatFast 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
};
