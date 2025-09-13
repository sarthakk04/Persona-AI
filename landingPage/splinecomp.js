
import Spline from "@splinetool/react-spline/next";

export default function Home() {
  const letters = "PERSONA".split("");

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Background Spline */}
      <Spline scene="https://prod.spline.design/aXIekA1i-0MYrNdj/scene.splinecode" />

      {/* Floating comment dialog boxes (left & right edges only) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left side */}
        <div className="absolute left-3 bottom-20 px-6 py-3 rounded-2xl bg-[#e9bcf6] text-black shadow-lg 
          animate-floatSlow">
          💜 Welcome to Persona
        </div>
         <div className="absolute left-6 bottom-28 px-6 py-3 rounded-2xl bg-[#e9bcf6] text-black shadow-lg 
          animate-floatSlow">
          💜 Lets have a chat
        </div>
        <div className="absolute left-5 bottom-52 px-6 py-3 rounded-2xl bg-[#e9bcf6] text-black shadow-lg 
          animate-floatMed">
          🌌 feeling Lonely
        </div>

        {/* Right side */}
        <div className="absolute right-6 bottom-32 px-6 py-3 rounded-2xl bg-[#e9bcf6] text-black shadow-lg 
          animate-floatFast">
          🔮 Try interacting!
        </div>
        <div className="absolute right-6 bottom-60 px-6 py-3 rounded-2xl bg-[#e9bcf6] text-black shadow-lg 
          animate-floatMed">
          💖 Hey i am Ronaldo
        </div>
      </div>

      {/* Top-right Button */}
      <button
        className="absolute top-6 right-6 px-8 py-3 
        bg-gradient-to-r from-[#b849f7] to-[#c87afe] 
        text-white font-bold text-lg rounded-full shadow-lg
        hover:scale-105 transition-transform duration-300 z-20"
      >
        Try it NOW!
      </button>

      {/* Bottom Text (interactive letters) */}
      <div
        className="absolute bottom-0 w-full text-center flex justify-center 
        space-x-[0.1em] text-[200px] font-extrabold tracking-widest 
        bg-gradient-to-b from-[#100044] via-[#b849f7] to-[#c87afe] bg-clip-text text-transparent
        drop-shadow-[0_5px_10px_rgba(0,0,0,0.7)] leading-none z-20"
      >
        {letters.map((char, i) => (
          <span
            key={i}
            className="transition-all duration-300 ease-in-out 
            hover:scale-110 hover:drop-shadow-[0_8px_15px_rgba(0,0,0,0.9)]"
          >
            {char}
          </span>
        ))}
      </div>
    </main>
  );
}

// import Spline from "@splinetool/react-spline/next";
// import PersonaText from "./personaText"
// export default function Home() {
//   return (
//     <main className="relative w-full h-screen">
//       {/* Background Spline */}
//       <Spline scene="https://prod.spline.design/aXIekA1i-0MYrNdj/scene.splinecode" />

//       {/* Overlay Text */}
//    <h1 className="absolute bottom-0 w-full text-center text-[200px] font-extrabold tracking-widest 
//         bg-gradient-to-b from-[#100044] via-[#b849f7] to-[#c87afe] bg-clip-text text-transparent drop-shadow-[0_5px_10px_rgba(0,0,0,0.7)]">
//         PERSONA
//       </h1>
    
//     </main>
//   );
// }



