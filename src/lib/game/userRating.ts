import { DEFAULT_USER_RATING, clampRating } from "./rating";

const STORAGE_KEY = "rtn:userRating";

function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem("__rtn_storage_test__", "1");
    window.localStorage.removeItem("__rtn_storage_test__");
    return true;
  } catch {
    return false;
  }
}

export function getStoredUserRating(): number {
  if (!isStorageAvailable()) return DEFAULT_USER_RATING;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return DEFAULT_USER_RATING;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? clampRating(parsed) : DEFAULT_USER_RATING;
  } catch {
    return DEFAULT_USER_RATING;
  }
}

export function setStoredUserRating(rating: number): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(clampRating(rating)));
  } catch {
    // quota/private-browsing write failure — degrade silently, game still works
  }
}
