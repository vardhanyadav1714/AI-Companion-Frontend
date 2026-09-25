import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Portrait } from "@/components/companions/Portrait";
import { companions } from "@/lib/companions";
export function generateStaticParams() { return companions.map(c => ({ id: c.id })); }
export default async function CompanionProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const c = companions.find(c => c.id === id); if (!c) notFound();
  return <AppShell title={`Meet ${c.name}`}><div className="e-profile"><Link href="/companions" className="e-back-link"><ArrowLeft size={18} />All companions</Link><div className="e-profile-grid"><Portrait companion={c} priority /><section><span className="e-eyebrow">YOUR AI COMPANION</span><h1>{c.name}</h1><p className="e-profile-description">{c.description}</p><div className="e-tags">{c.traits.map(t => <span key={t}>{t}</span>)}</div><blockquote>&ldquo;{c.greeting}&rdquo;</blockquote><Link className="e-button" href={`/chat?companion=${c.id}`}><MessageCircle size={18} />Chat with {c.name}<ArrowUpRight size={18} /></Link><dl className="e-details"><div><dt>Personality</dt><dd>{c.personality}</dd></div><div><dt>Conversation style</dt><dd>{c.conversationStyle}</dd></div><div><dt>Languages</dt><dd>{c.language}</dd></div><div><dt>Little joys</dt><dd>{c.interests.join(", ")}</dd></div></dl></section></div></div></AppShell>;
}
