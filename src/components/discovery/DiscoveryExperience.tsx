"use client";

import { ArrowUpRight, Heart, Search, X, MessageCircle, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Portrait } from "@/components/companions/Portrait";
import { AppShell } from "@/components/layout/AppShell";
import { useFavorites } from "@/hooks/useFavorites";
import { companions } from "@/lib/companions";

const moods: Record<string, string[]> = { "Everyone": companions.map(c => c.id), "A listening ear": ["eva", "riya", "mira"], "A little laughter": ["nova", "sera"], "Something deeper": ["aria", "mira", "eva"] };
export function DiscoveryExperience({ savedOnly = false }: { savedOnly?: boolean }) {
  const [query, setQuery] = useState("");
  const [mood, setMood] = useState("Everyone");
  const [language, setLanguage] = useState("All languages");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { favorites, toggle, ready } = useFavorites();
  const shown = companions.filter(c => (!savedOnly || favorites.includes(c.id)) && moods[mood].includes(c.id) && (language === "All languages" || c.language.includes(language)) && `${c.name} ${c.personality} ${c.interests.join(" ")} ${c.language}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <AppShell active={savedOnly ? "saved" : "discover"} title={savedOnly ? "Your saved companions" : "Discover"}>
    <div className="e-discovery"><header className="e-page-heading"><div><span className="e-eyebrow">{savedOnly ? "CLOSE TO YOU" : "GOOD COMPANY, YOUR WAY"}</span><h1>{savedOnly ? "Your favorites" : "Meet your companions"}</h1><p>{savedOnly ? "Familiar faces. Conversations to come back to." : "For the big feelings, little wins, and everything in between."}</p></div><span className="e-label"><span className="e-status-dot" /> AI companions</span></header>
      <div className="e-discovery-tools"><div className="e-search"><Search size={19} /><input aria-label="Search companions" placeholder="Find your kind of company" value={query} onChange={e => setQuery(e.target.value)} />{query && <button className="e-icon" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}</div><button className="e-button e-secondary" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={17} /><span>Filters</span></button></div>
      {filtersOpen && <div className="e-filter-settings"><label>Language<select value={language} onChange={e => setLanguage(e.target.value)}>{["All languages", "English", "Hindi", "Tamil"].map(l => <option key={l}>{l}</option>)}</select></label><button className="e-text-button" onClick={() => { setLanguage("All languages"); setMood("Everyone"); setQuery(""); }}>Reset filters</button></div>}
      <div className="e-mood-tabs" role="group" aria-label="Conversation mood">{Object.keys(moods).map(m => <button key={m} aria-pressed={mood === m} onClick={() => setMood(m)}>{m}</button>)}<span>{shown.length} companions</span></div>
      <div className="e-companion-grid">{shown.map((c, i) => <article className="e-companion" key={c.id}>
        <div className="e-companion-image"><Link href={`/companions/${c.id}`} aria-label={`Meet ${c.name}`}><Portrait companion={c} priority={i < 3} /></Link><button className="e-save" disabled={!ready} aria-pressed={favorites.includes(c.id)} aria-label={`${favorites.includes(c.id) ? "Unsave" : "Save"} ${c.name}`} title={`${favorites.includes(c.id) ? "Unsave" : "Save"} ${c.name}`} onClick={() => toggle(c.id)}><Heart size={19} fill={favorites.includes(c.id) ? "currentColor" : "none"} /></button><span className="e-image-label">{c.tags[0]}</span></div>
        <div className="e-companion-copy"><div className="e-card-heading"><Link href={`/companions/${c.id}`}><h2>{c.name}</h2></Link><span>{c.language}</span></div><p>{c.description}</p><div className="e-card-footer"><span>{c.tags.slice(1).join(" / ")}</span><Link href={`/chat?companion=${c.id}`} className="e-chat-link" aria-label={`Chat with ${c.name}`}><MessageCircle size={17} /><span>Chat</span><ArrowUpRight size={15} /></Link></div></div>
      </article>)}</div>
      {savedOnly && !ready ? <p role="status">Loading favorites...</p> : shown.length === 0 && <div className="e-empty"><Heart size={30} /><h2>{savedOnly && !favorites.length ? "Your favorites start here" : "No companions found"}</h2><p>{savedOnly && !favorites.length ? "A familiar face makes all the difference." : "No matches for the current search and filters."}</p>{savedOnly && !favorites.length ? <Link className="e-button e-secondary" href="/companions">Explore companions</Link> : <button className="e-button e-secondary" onClick={() => { setQuery(""); setMood("Everyone"); setLanguage("All languages"); }}>Clear filters</button>}</div>}
      <footer className="e-discovery-footer"><span>A little space to be yourself.</span><Link href="/subscription">More time together <ArrowUpRight size={15} /></Link></footer>
    </div>
  </AppShell>;
}
