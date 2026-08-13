"use client";

import dynamic from "next/dynamic";

// The round is randomized client-side, so it must never be rendered on the
// server (would mismatch on hydration) — load PlayGame client-only instead.
const PlayGame = dynamic(() => import("@/components/PlayGame"), {
  ssr: false,
  loading: () => (
    <div className="wood-panel flex flex-1 items-center justify-center">
      <p className="text-sm text-surface/70">Loading jerseys…</p>
    </div>
  ),
});

export default function PlayPage() {
  return <PlayGame />;
}
