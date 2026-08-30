"use client";

import { useSyncExternalStore } from "react";
import { getStoredUserRating } from "@/lib/game/userRating";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): number | null {
  return getStoredUserRating();
}

function getServerSnapshot(): number | null {
  return null;
}

export function UserRatingBadge() {
  const rating = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (rating === null) return null;

  return (
    <span className="text-xs font-medium uppercase tracking-wider text-foreground/50">
      Your rating: <span className="text-wood-dark">{rating.toFixed(1)}</span>
    </span>
  );
}
