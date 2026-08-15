import { Button } from "@/components/design/Buttons";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <h1>That space is not here.</h1>
      <p>The companion or page you opened does not exist.</p>
      <Button href="/companions">Back to companions</Button>
    </main>
  );
}
