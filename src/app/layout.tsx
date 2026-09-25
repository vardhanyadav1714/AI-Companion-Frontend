import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "@/app/globals.css";
import "@/app/eva.css";
const themeScript = `(()=>{try{const t=localStorage.getItem('eva-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch{}})();`;

export const metadata: Metadata = {
  title: { default: "Eva - Your AI companions", template: "%s | Eva" },
  description: "Your own little corner for thoughtful conversations with AI companions.",
  icons: {
    icon: [{ url: "/branding/eva-icon-192.png?v=2", type: "image/png", sizes: "192x192" }],
    shortcut: "/favicon.ico?v=2"
  }
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f8f9fa" }, { media: "(prefers-color-scheme: dark)", color: "#141517" }] };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><ThemeProvider>{children}</ThemeProvider></body></html>;
}
