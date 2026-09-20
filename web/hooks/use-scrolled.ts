"use client";

import { useEffect, useState } from "react";

/**
 * True once the page has scrolled past `threshold`. Drives the header's
 * frosted state (the draft's `.hdr.solid` at scrollY > 40).
 */
export function useScrolled(threshold = 40): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return scrolled;
}
