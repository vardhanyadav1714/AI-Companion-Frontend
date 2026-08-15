"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/design/Buttons";
import { CompanionAvatar } from "@/components/companions/CompanionAvatar";
import { CompanionBadge } from "@/components/companions/CompanionBadge";
import { MoodIndicator } from "@/components/companions/MoodIndicator";
import { type Companion, getCompanionThemeVars } from "@/lib/companions";

export function CompanionCard({ companion, index }: { companion: Companion; index: number }) {
  return (
    <motion.article
      className="companion-card"
      style={getCompanionThemeVars(companion)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
    >
      <Link href={`/companions/${companion.id}`} className="companion-card-link" aria-label={`Open ${companion.name}`}>
        <div className="companion-card-portrait">
          <CompanionAvatar companion={companion} size="large" />
        </div>
        <div className="companion-card-body">
          <div className="companion-card-topline">
            <MoodIndicator mood={companion.mood} />
          </div>
          <h3>{companion.name}</h3>
          <p>{companion.description}</p>
          <div className="badge-row">
            {companion.tags.map((tag) => (
              <CompanionBadge key={tag} label={tag} />
            ))}
          </div>
          <div className="companion-card-action">
            <Button href={`/chat?companion=${companion.id}`} icon={<ArrowRight size={17} />} variant="secondary">
              Chat with her
            </Button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
