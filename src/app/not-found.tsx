import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
export default function NotFound() {
  return <AppShell title="Page not found"><section className="e-empty"><h1>That page is not here</h1><p>The companion or page you opened does not exist.</p><Link className="e-button e-primary" href="/companions">Back to companions</Link></section></AppShell>;
}
