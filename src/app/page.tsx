import { AnimatedBackground } from "@/components/design/AnimatedBackground";
import { SiteNav } from "@/components/layout/SiteNav";
import { LandingExperience } from "@/components/landing/LandingExperience";

export default function HomePage() {
  return (
    <main className="site-page">
      <AnimatedBackground />
      <SiteNav />
      <LandingExperience />
    </main>
  );
}
