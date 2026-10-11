"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";
import { Brand } from "@/components/layout/AppShell";
import { ThemeSwitcher } from "@/components/layout/ThemeProvider";

type Place = { id: string; label: string; countryCode: string; billingAdministrativeArea: string | null };

export default function Onboarding() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState<Place | null>(null);
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [useForBilling, setUseForBilling] = useState(true);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  function selectPlace(selected: Place) { setPlace(selected); setQuery(selected.label); setSuggestions([]); setActiveSuggestion(-1); }
  useEffect(() => {
    const controller = new AbortController();
    setSuggestions([]); setSearchError(""); setSearching(false); setActiveSuggestion(-1);
    if (place || query.trim().length < 2) return;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await apiRequest<{ places: Place[] }>(`/places?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal });
        if (controller.signal.aborted) return;
        if (!response.success) throw new Error(response.error.message);
        setSuggestions(response.data.places);
        if (!response.data.places.length) setSearchError("No matching city. Try a nearby town.");
      } catch (error) {
        if (!controller.signal.aborted) setSearchError(error instanceof Error ? error.message : "Could not search cities");
      } finally { if (!controller.signal.aborted) setSearching(false); }
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, place]);
  return <main className="e-auth"><header><Brand /><ThemeSwitcher /></header><section className="e-auth-content"><form className="e-form" onSubmit={async event => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      if (!place) throw new Error("Select your city from the suggestions.");
      const result = await apiRequest("/profile", { method: "PUT", body: JSON.stringify({ preferredName: name, dateOfBirth: birthday,
        currentPlaceId: place.id, useLocationForBilling: useForBilling && Boolean(place.billingAdministrativeArea) }) });
      if (!result.success) throw new Error(result.error.message);
      router.replace("/companions");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save profile"); }
    finally { setBusy(false); }
  }}><h1>A little about you</h1>
    <label>What should we call you?<input required maxLength={80} autoComplete="nickname" value={name} onChange={event => setName(event.target.value)} /></label>
    <label>Birthday<input required type="date" autoComplete="bday" value={birthday} onChange={event => setBirthday(event.target.value)} /></label>
    <div className="e-place-search">
      <label htmlFor="current-city">City you live in</label>
      <input id="current-city" required maxLength={80} autoComplete="off" role="combobox" aria-autocomplete="list"
        aria-expanded={suggestions.length > 0} aria-controls="city-suggestions"
        aria-activedescendant={activeSuggestion >= 0 ? `city-option-${activeSuggestion}` : undefined}
        disabled={busy} value={query} onChange={event => { setQuery(event.target.value); setPlace(null); }}
        onKeyDown={event => {
          if (event.key === "ArrowDown" && suggestions.length) { event.preventDefault(); setActiveSuggestion(index => (index + 1) % suggestions.length); }
          if (event.key === "ArrowUp" && suggestions.length) { event.preventDefault(); setActiveSuggestion(index => (index <= 0 ? suggestions.length : index) - 1); }
          if (event.key === "Enter" && suggestions.length) { event.preventDefault(); selectPlace(suggestions[Math.max(activeSuggestion, 0)]!); }
          if (event.key === "Escape") { setSuggestions([]); setActiveSuggestion(-1); }
        }} />
      <div id="city-suggestions" role="listbox" aria-label="Matching cities" className="e-place-results">
        {suggestions.map((suggestion, index) => <button id={`city-option-${index}`} key={suggestion.id} type="button" role="option"
          aria-selected={index === activeSuggestion} onClick={() => selectPlace(suggestion)}>{suggestion.label}</button>)}
      </div>
      <div aria-live="polite">{searching ? "Searching..." : searchError}</div>
      {place?.billingAdministrativeArea && <label className="e-place-billing"><input type="checkbox" checked={useForBilling} disabled={busy}
        onChange={event => setUseForBilling(event.target.checked)} />Use this state for billing</label>}
      <a className="e-place-attribution" href="https://www.geonames.org/" target="_blank" rel="noreferrer">Places by GeoNames</a>
    </div>
    <p>Your companions can remember these details. You must be 18 or older.</p>
    {error && <p role="alert">{error}</p>}
    <button className="e-button e-primary" disabled={busy}>{busy ? "Saving..." : "Continue"}</button>
  </form></section></main>;
}
