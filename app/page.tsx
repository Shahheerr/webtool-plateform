import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ToolsGrid } from "@/components/tools-grid";

export default function Home() {
  return (
    <div className="dark min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ToolsGrid />
      </main>
    </div>
  );
}
