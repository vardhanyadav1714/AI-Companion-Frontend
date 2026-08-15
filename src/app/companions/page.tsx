import { AnimatedBackground } from "@/components/design/AnimatedBackground";
import { SectionHeading } from "@/components/design/SectionHeading";
import { CompanionCard } from "@/components/companions/CompanionCard";
import { SiteNav } from "@/components/layout/SiteNav";
import { companions } from "@/lib/companions";

export default function CompanionsPage() {
  return (
    <main className="site-page sub-page">
      <AnimatedBackground />
      <SiteNav />
      <section className="content-section discovery-hero">
        <SectionHeading eyebrow="Companion discovery" title="Browse personalities with their own atmosphere.">
          Pick the energy you want to enter tonight. Each profile is built from reusable companion data.
        </SectionHeading>
        <div className="companion-grid">
          {companions.map((companion, index) => (
            <CompanionCard key={companion.id} companion={companion} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
