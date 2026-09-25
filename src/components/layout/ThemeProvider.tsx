"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void }>({ theme: "system", setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, update] = useState<Theme>("system");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const saved = localStorage.getItem("eva-theme"); if (saved === "light" || saved === "dark") update(saved); } catch {}
    setReady(true);
    const sync = (event: StorageEvent) => { if (event.key === "eva-theme") update(event.newValue === "light" || event.newValue === "dark" ? event.newValue : "system"); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => { document.documentElement.dataset.theme = theme === "system" ? media.matches ? "dark" : "light" : theme; };
    apply(); media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme, ready]);
  function setTheme(value: Theme) { update(value); try { localStorage.setItem("eva-theme", value); } catch {} }
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <div className="e-theme" role="group" aria-label="Appearance">
    {([{ id: "light", icon: Sun }, { id: "system", icon: Monitor }, { id: "dark", icon: Moon }] as const).map(({ id, icon: Icon }) =>
      <button type="button" key={id} aria-label={`${id[0].toUpperCase() + id.slice(1)} theme`} aria-pressed={theme === id} title={`${id[0].toUpperCase() + id.slice(1)} theme`} onClick={() => setTheme(id)}><Icon size={17} /></button>)}
  </div>;
}
