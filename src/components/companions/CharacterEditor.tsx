"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Archive, Check, Save } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Portrait } from "./Portrait";
import { companions } from "@/lib/companions";
import { apiRequest } from "@/lib/api-client";
import { characterTraits, type CustomCompanion } from "@/lib/custom-companions";
import { useCustomCompanions } from "@/hooks/useCustomCompanions";
import "./character-editor.css";

const empty = { name: "", age: 24, avatarId: "eva", traits: ["Caring"], interests: "", backstory: "", language: "Automatic", conversationStyle: "natural", archived: false };
export function CharacterEditor({ id }: { id?: string }) {
  const catalog = useCustomCompanions();
  const [form, setForm] = useState(empty);
  const [savedId, setSavedId] = useState(id);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const record = catalog.characters.find(c => c.id === id);
    if (record) { const { id: unused, ...values } = record; void unused; setForm(values); }
  }, [id, catalog.characters]);
  async function save(archived = form.archived) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError(""); setSaved(false);
    try {
      const body = { ...form, archived };
      const result = await apiRequest<CustomCompanion>(savedId ? `/companions/${savedId}` : "/companions", {
        method: savedId ? "PATCH" : "POST", body: JSON.stringify(savedId ? body : { name: body.name, age: body.age, avatarId: body.avatarId, traits: body.traits, interests: body.interests, backstory: body.backstory, language: body.language, conversationStyle: body.conversationStyle })
      });
      if (!result.success) throw new Error(result.error.message);
      setSavedId(result.data.id); setForm({ ...form, archived }); setSaved(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save companion."); }
    finally { lock.current = false; setBusy(false); }
  }
  const unavailable = id && !catalog.loading && !catalog.characters.some(c => c.id === id);
  return <AppShell active="discover" title="Your companion"><div className="e-character-editor">
    <Link href="/companions" className="e-text-button"><ArrowLeft size={17} /> Companions</Link>
    <header className="e-page-heading"><div><span className="e-eyebrow">PRIVATE TO YOU</span><h1>{savedId ? "Edit companion" : "Create companion"}</h1></div></header>
    {catalog.loading ? <p role="status">Loading...</p> : catalog.signedOut ? <Link href="/login" className="e-button">Sign in</Link> : catalog.error || unavailable ? <p role="alert">{catalog.error || "Companion not found."}</p> : <form onSubmit={event => { event.preventDefault(); void save(); }}>
      <fieldset disabled={busy}><legend>Portrait</legend><div className="e-character-portraits">{companions.map(c => <button key={c.id} type="button" title={`Choose ${c.name} portrait`} aria-label={`Choose ${c.name} portrait`} aria-pressed={form.avatarId === c.id} onClick={() => { setForm({ ...form, avatarId: c.id }); setSaved(false); }}><Portrait companion={c} />{form.avatarId === c.id && <Check size={16} />}</button>)}</div></fieldset>
      <fieldset disabled={busy} className="e-character-fields"><legend>Character</legend>
        <label>Name<input required maxLength={40} value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setSaved(false); }} /></label>
        <label>Age<input required type="number" min={18} max={100} value={form.age} onChange={e => setForm({ ...form, age: Number(e.target.value) })} /></label>
        <label>Language<select aria-label="Language" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>{["Automatic", "English", "Hindi", "Hinglish"].map(v => <option key={v}>{v}</option>)}</select></label>
        <label>Conversation style<select aria-label="Conversation style" value={form.conversationStyle} onChange={e => setForm({ ...form, conversationStyle: e.target.value })}>{["natural", "soft", "flirty", "direct", "deep"].map(v => <option key={v} value={v}>{v[0].toUpperCase() + v.slice(1)}</option>)}</select></label>
      </fieldset>
      <fieldset disabled={busy}><legend>Personality</legend><div className="e-character-traits">{characterTraits.map(trait => <label key={trait}><input type="checkbox" checked={form.traits.includes(trait)} disabled={!form.traits.includes(trait) && form.traits.length >= 4} onChange={e => setForm({ ...form, traits: e.target.checked ? [...form.traits, trait] : form.traits.filter(t => t !== trait) })} />{trait}</label>)}</div></fieldset>
      <label>Interests<input disabled={busy} maxLength={200} value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })} /></label>
      <label>Backstory<textarea disabled={busy} rows={4} maxLength={600} value={form.backstory} onChange={e => setForm({ ...form, backstory: e.target.value })} /></label>
      {error && <p role="alert" className="e-alert">{error}</p>}{saved && <p role="status">{form.archived ? "Companion archived. Your chat history is kept." : "Companion saved."}</p>}
      <div className="e-character-actions"><button className="e-button" disabled={busy || !form.name.trim() || !form.traits.length}><Save size={17} />{busy ? "Saving..." : "Save companion"}</button>{savedId && !form.archived && <Link className="e-button e-secondary" href={`/chat?companion=${savedId}`}>Chat</Link>}{savedId && <button disabled={busy} type="button" className="e-text-button" onClick={() => { if (form.archived || window.confirm("Archive this companion? Your chat history will be kept.")) void save(!form.archived); }}><Archive size={16} />{form.archived ? "Restore" : "Archive"}</button>}</div>
    </form>}
  </div></AppShell>;
}
