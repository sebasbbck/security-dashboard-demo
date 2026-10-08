"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Loads data from the API and refetches whenever `key` changes.
 * Earlier requests are aborted so a slow response never overwrites a newer one.
 * `setData` is exposed for optimistic updates.
 */
export function useFetch<T>(load: (signal: AbortSignal) => Promise<T>, key: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  // The key the current data belongs to; while it differs from `key`, a request is in flight.
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  // Keep the latest loader without making it an effect dependency
  // (callers usually pass an inline arrow function).
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    const controller = new AbortController();
    loadRef
      .current(controller.signal)
      .then((result) => {
        setData(result);
        setError(null);
        setLoadedKey(key);
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setLoadedKey(key);
      });
    return () => controller.abort();
  }, [key]);

  return { data, setData, error, setError, loading: loadedKey !== key };
}
