"use client";

// Favourites: product slugs in this browser's localStorage only (owner decision 4: no accounts,
// no server). Every heart and the favourites page share one store and stay in sync across tabs.
import { useSyncExternalStore } from "react";

const KEY = "abood:favorites";
const listeners = new Set<() => void>();
const EMPTY: string[] = [];
let cache: { raw: string | null; list: string[] } = { raw: null, list: EMPTY };

function read(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    // storage blocked (private mode, settings): favourites just don't persist
  }
  if (raw === cache.raw) return cache.list;
  let list: string[] = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) list = parsed.filter((x): x is string => typeof x === "string");
  } catch {
    // corrupt value: start empty
  }
  cache = { raw, list };
  return list;
}

function write(list: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // ignore: memory-only for this page view
    cache = { raw: JSON.stringify(list), list };
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Favourite slugs, newest first. Empty on the server and on the first client render. */
export function useFavorites(): string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleFavorite(slug: string) {
  const list = read();
  write(list.includes(slug) ? list.filter((s) => s !== slug) : [slug, ...list]);
}
