"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Live `matchMedia` as a React value.
 *
 * `getServerSnapshot` returns false so the server and the first client
 * render agree — the query result only takes effect after hydration.
 * Reading `window.matchMedia` directly during render would mismatch.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
