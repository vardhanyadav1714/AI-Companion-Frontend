import type { Metadata, Viewport } from "next";

import "@/app/globals.css";

const darkReaderHydrationCleanup = `
(() => {
  const clean = (root = document) => {
    root.querySelectorAll?.("[data-darkreader-inline-stroke], [data-darkreader-inline-fill], [data-darkreader-inline-bgcolor], [data-darkreader-inline-color], [data-darkreader-inline-border], [data-darkreader-proxy-injected]").forEach((node) => {
      for (const attribute of Array.from(node.attributes)) {
        if (attribute.name.startsWith("data-darkreader")) {
          node.removeAttribute(attribute.name);
        }
      }

      if (node instanceof HTMLElement || node instanceof SVGElement) {
        for (const property of Array.from(node.style)) {
          if (property.startsWith("--darkreader")) {
            node.style.removeProperty(property);
          }
        }

        if (!node.getAttribute("style")) {
          node.removeAttribute("style");
        }
      }
    });
  };

  clean();
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.target instanceof Element) {
        clean(mutation.target);
      }
    }
  });

  observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });

  window.setTimeout(() => observer.disconnect(), 5000);
})();
`;

export const metadata: Metadata = {
  title: "Meri GF - AI Companion",
  description: "A premium AI companion experience with memory, personality, and emotional continuity."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090d1b"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <script dangerouslySetInnerHTML={{ __html: darkReaderHydrationCleanup }} />
      </body>
    </html>
  );
}
