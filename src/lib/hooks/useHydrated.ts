"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * false ตอน SSR และเฟรมแรกของ hydration, true หลังจากนั้น
 * ใช้ตัดสินใจว่า "ซ่อนเนื้อหารอ animation ได้หรือยัง" — ก่อน hydrate ต้องแสดงเนื้อหาเสมอ
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
