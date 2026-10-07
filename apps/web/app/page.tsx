// Phase 1 placeholder. The real dashboard follows the user's design
// screenshot in Phase 3 — NOT a Spotify/Apple/YouTube clone. This page
// only proves the web build + API health plumbing work.
// Server-side fetch: plain API_URL works at runtime (no NEXT_PUBLIC_
// bake-in). Compose sets API_URL=http://api:4000; local dev defaults below.
async function getApiHealth(): Promise<string> {
  const base = process.env.API_URL ?? "http://localhost:4000";
  try {
    const res = await fetch(`${base}/health`, { cache: "no-store" });
    if (!res.ok) return `api unhealthy (http ${res.status})`;
    const body = (await res.json()) as { service?: string; status?: string };
    return `${body.service ?? "api"}: ${body.status ?? "unknown"}`;
  } catch {
    return "api unreachable (expected until compose is up)";
  }
}

export default async function Home() {
  const health = await getApiHealth();
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 p-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">RAE</h1>
        <p className="mt-2 text-neutral-400">
          Self-hosted Discord music bot. Playback lives in Discord voice — this web app is a remote
          control, never an audio player.
        </p>
      </div>
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        <p className="text-sm text-neutral-400">Foundation status (Phase 1)</p>
        <p className="mt-1 font-mono text-sm">{health}</p>
      </div>
      <p className="text-sm text-neutral-500">
        Full music UI arrives in Phase 3, built from the provided design reference.
      </p>
    </main>
  );
}
