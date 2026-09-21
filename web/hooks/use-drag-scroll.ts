"use client";

import { useEffect, type RefObject } from "react";

/** How far the pointer must travel before it counts as a drag, in px. */
const THRESHOLD = 5;

/**
 * Click-and-drag panning for a horizontal scroll container.
 *
 * Mouse only. Touch and pen already pan natively with momentum, and
 * taking those over would replace a good native gesture with a worse
 * hand-rolled one.
 *
 * Three things make this behave rather than fight the browser:
 *
 *  - Scroll snapping is switched off for the duration of the drag.
 *    `snap-mandatory` re-snaps after *every* scroll change, so with it
 *    left on, each `scrollLeft` write is yanked straight back and the
 *    row feels stuck.
 *  - The click that follows a drag is swallowed in the capture phase.
 *    Without that, letting go over a card follows its link.
 *  - Native dragging of images and links is cancelled, or the browser
 *    starts a drag-and-drop instead of panning.
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let activeId: number | null = null;
    let startX = 0;
    let startScroll = 0;
    let dragging = false;

    const stop = () => {
      dragging = false;
      activeId = null;
      el.style.scrollSnapType = "";
      el.style.userSelect = "";
      delete el.dataset.dragging;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      // Clear any suppression left over from a previous drag whose
      // click never arrived, so it can't swallow this interaction's.
      delete el.dataset.justDragged;
      activeId = event.pointerId;
      startX = event.clientX;
      startScroll = el.scrollLeft;
      dragging = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (activeId !== event.pointerId) return;
      const dx = event.clientX - startX;

      if (!dragging) {
        // Below the threshold this is still a click, not a drag.
        if (Math.abs(dx) < THRESHOLD) return;
        dragging = true;
        el.setPointerCapture(event.pointerId);
        el.style.scrollSnapType = "none";
        el.style.userSelect = "none";
        el.dataset.dragging = "true";
      }

      event.preventDefault();
      el.scrollLeft = startScroll - dx;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (activeId !== event.pointerId) return;
      if (dragging && el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
      const wasDragging = dragging;
      stop();
      // Re-enabling mandatory snapping settles the row on a card.
      if (wasDragging) el.dataset.justDragged = "true";
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!el.dataset.justDragged) return;
      delete el.dataset.justDragged;
      event.preventDefault();
      event.stopPropagation();
    };

    const onDragStart = (event: Event) => event.preventDefault();

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("dragstart", onDragStart);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("dragstart", onDragStart);
      stop();
    };
  }, [ref]);
}
