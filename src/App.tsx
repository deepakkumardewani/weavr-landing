import { useRef } from "react";
import { useScrollBridge } from "./hooks/useScrollBridge";
import { useThemeScroll } from "./hooks/useThemeScroll";
import { Header } from "./components/layout/Header";
import { HeroJsonl } from "./components/hero/HeroJsonl";
import { WeaveMorph } from "./components/transform/WeaveMorph";
import { FunnelStream } from "./components/transform/FunnelStream";
import { OutputPanel } from "./components/output/OutputPanel";
import { SpeedStats } from "./components/speed/SpeedStats";
import { FeatureGrid } from "./components/features/FeatureGrid";
import { InstallSection } from "./components/install/InstallSection";
import { Footer } from "./components/layout/Footer";
import { demoSession } from "./data/demo-session";

/**
 * Composition root. The page is one continuous light -> dark scroll: hero (S1)
 * and the weave morph (S2) ride the interpolated palette, then everything from
 * the output centerpiece (S3) down is pinned dark via `.theme-dark` so the
 * supporting sections read as weavr's finished, dark-mode artefact.
 */
export default function App() {
  useScrollBridge();
  const outputRef = useRef<HTMLDivElement>(null);
  useThemeScroll(outputRef);

  return (
    <>
      <Header />
      <main id="top" className="bg-bg text-fg">
        {/* Single relative wrapper so FunnelStream can span both S1 + S2 as one
            absolute layer — no reparenting jump at the section boundary. */}
        <div className="relative">
          <FunnelStream />
          <HeroJsonl />
          <WeaveMorph events={demoSession} />
        </div>
        <div ref={outputRef}>
          <OutputPanel events={demoSession} />
        </div>
        <SpeedStats />
        <FeatureGrid />
        <InstallSection />
      </main>
      <Footer />
    </>
  );
}
