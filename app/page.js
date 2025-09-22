import { AuroraBackground } from "@/landingPage/splinecomp";
import Landing from "@/landingPage/landing";
export default function Home() {
  return (
    <>
      <div style={{ width: "100%", height: "9--px", position: "relative" }}>
        <AuroraBackground />
        <Landing />
      </div>
    </>
  );
}
