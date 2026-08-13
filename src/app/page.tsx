import Link from "next/link";
import { JerseySilhouette } from "@/components/JerseySilhouette";

const SPORTS = [
  { label: "All", enabled: false },
  { label: "NBA", enabled: true },
  { label: "NFL", enabled: false },
  { label: "MLB", enabled: false },
  { label: "NHL", enabled: false },
];

const MODES = [
  { label: "Fixed-5", enabled: true },
  { label: "Endless", enabled: false },
];

function SelectorChip({ label, enabled, selected }: { label: string; enabled: boolean; selected: boolean }) {
  if (!enabled) {
    return (
      <span
        aria-disabled="true"
        className="inline-flex items-center gap-1.5 rounded-full border border-disabled/60 bg-surface-muted px-3.5 py-1.5 text-sm text-foreground/40"
      >
        {label}
        <span className="text-[10px] uppercase tracking-wide text-foreground/30">soon</span>
      </span>
    );
  }
  return (
    <span
      aria-current={selected}
      className="inline-flex items-center rounded-full border border-brass bg-brass/15 px-3.5 py-1.5 text-sm font-medium text-wood-dark"
    >
      {label}
    </span>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="wood-panel relative flex flex-1 items-center justify-center overflow-hidden">
        <JerseySilhouette number="?" className="h-[75%] max-h-72 w-auto drop-shadow-lg" />
      </div>

      <main className="flex flex-col items-center gap-8 px-6 pb-10 pt-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">
            Retire the Number
          </h1>
          <p className="max-w-xs text-sm text-foreground/60">
            A jersey hangs, its team hidden. Name the player who wore it.
          </p>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-5">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-foreground/50">Sport</span>
            <div className="flex flex-wrap justify-center gap-2">
              {SPORTS.map((sport) => (
                <SelectorChip key={sport.label} label={sport.label} enabled={sport.enabled} selected={sport.label === "NBA"} />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-foreground/50">Mode</span>
            <div className="flex flex-wrap justify-center gap-2">
              {MODES.map((mode) => (
                <SelectorChip key={mode.label} label={mode.label} enabled={mode.enabled} selected={mode.label === "Fixed-5"} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-sm flex-col items-center gap-3">
          <Link
            href="/play"
            className="w-full rounded-full bg-wood-dark px-6 py-3.5 text-base font-medium text-surface shadow-sm transition-colors hover:bg-wood-mid"
          >
            Play
          </Link>
          <span
            aria-disabled="true"
            className="text-sm text-foreground/35"
          >
            Leaderboard — coming soon
          </span>
        </div>
      </main>
    </div>
  );
}
