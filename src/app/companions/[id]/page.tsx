import { ArrowRight, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";

import { AnimatedBackground } from "@/components/design/AnimatedBackground";
import { Button } from "@/components/design/Buttons";
import { CompanionAvatar } from "@/components/companions/CompanionAvatar";
import { CompanionBadge } from "@/components/companions/CompanionBadge";
import { MoodIndicator } from "@/components/companions/MoodIndicator";
import { SiteNav } from "@/components/layout/SiteNav";
import { companions, getCompanionThemeVars } from "@/lib/companions";

type CompanionProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return companions.map((companion) => ({
    id: companion.id
  }));
}

export default async function CompanionProfilePage({ params }: CompanionProfilePageProps) {
  const { id } = await params;
  const companion = companions.find((item) => item.id === id);

  if (!companion) {
    notFound();
  }

  return (
    <main className="site-page profile-page" style={getCompanionThemeVars(companion)}>
      <AnimatedBackground />
      <SiteNav />
      <section className="profile-hero">
        <div className="profile-portrait">
          <CompanionAvatar companion={companion} size="hero" />
        </div>
        <div className="profile-copy">
          <MoodIndicator mood={companion.mood} />
          <h1>{companion.name}</h1>
          <p className="profile-traits">{companion.traits.join(" - ")}</p>
          <p className="profile-greeting">"{companion.greeting}"</p>
          <div className="hero-actions">
            <Button href={`/chat?companion=${companion.id}`} icon={<MessageCircle size={18} />}>
              Start chatting
            </Button>
            <Button href="/companions" icon={<ArrowRight size={18} />} variant="secondary">
              See others
            </Button>
          </div>
        </div>
      </section>

      <section className="profile-details">
        <div className="profile-detail-block">
          <h2>Personality</h2>
          <p>{companion.personality}</p>
        </div>
        <div className="profile-detail-block">
          <h2>Conversation Style</h2>
          <p>{companion.conversationStyle}</p>
        </div>
        <div className="profile-detail-block">
          <h2>Interests</h2>
          <div className="badge-row">
            {companion.interests.map((interest) => (
              <CompanionBadge key={interest} label={interest} />
            ))}
          </div>
        </div>
        <div className="profile-detail-block sample-block">
          <h2>Sample Messages</h2>
          {companion.sampleMessages.map((message) => (
            <p key={message} className="sample-message">
              {message}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
