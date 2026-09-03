"use client";

import { useEffect, useRef, useState } from "react";
import { REGIONS, TOTAL_BRANCHES, type RegionKey } from "@/data/branches";
import { useSound } from "@/lib/sound/SoundContext";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { CountUp } from "@/components/ui/CountUp";

export function Branches() {
  const { engine } = useSound();
  const reduced = useReducedMotion();
  const [active, setActive] = useState<RegionKey>(REGIONS[0].key);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  // แถบพื้นหลังสีแดงเลื่อนตำแหน่งไปยังแท็บที่เลือกแบบ smooth
  useEffect(() => {
    const sync = () => {
      const tabs = tabsRef.current;
      const pill = pillRef.current;
      if (!tabs || !pill) return;
      const el = tabs.querySelector<HTMLButtonElement>(
        `[data-tab="${active}"]`,
      );
      if (!el) return;
      pill.style.width = `${el.offsetWidth}px`;
      pill.style.transform = `translateX(${el.offsetLeft - 5}px)`;
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [active]);

  const onTab = (key: RegionKey) => {
    setActive(key);
    engine.marimba();
  };

  return (
    <section id="branches" className="mx-auto max-w-[1240px] px-6 pt-5 pb-24">
      <div className="mb-8 flex flex-wrap items-end gap-6">
        <div>
          <h2 className="mb-2 font-display text-[clamp(26px,3vw,40px)] font-semibold">
            สาขาในประเทศไทย
          </h2>
          <div className="text-base text-ink/60">
            <b className="font-display text-[22px] text-kawai-red">
              <CountUp from={0} to={TOTAL_BRANCHES} duration={900} />
            </b>{" "}
            สาขาทั่วประเทศ
          </div>
        </div>

        <div
          ref={tabsRef}
          role="tablist"
          aria-label="ภูมิภาคของสาขา"
          className="relative flex flex-wrap gap-1 rounded-full border border-ink/8 bg-white p-[5px] md:ml-auto"
        >
          <span
            ref={pillRef}
            aria-hidden="true"
            style={{
              transitionProperty: "transform, width",
              transitionDuration: "var(--dur-base)",
              transitionTimingFunction: "var(--ease-out)",
            }}
            className="absolute top-[5px] left-[5px] h-[calc(100%-10px)] w-0 rounded-full bg-kawai-red"
          />
          {REGIONS.map((region) => (
            <button
              key={region.key}
              type="button"
              role="tab"
              data-tab={region.key}
              id={`tab-${region.key}`}
              aria-selected={active === region.key}
              aria-controls="branch-panel"
              onClick={() => onTab(region.key)}
              style={{
                color: active === region.key ? "#fff" : "rgb(15,16,21)",
                transitionProperty: "color",
                transitionDuration: "var(--dur-base)",
                transitionTimingFunction: "var(--ease-out)",
              }}
              className="relative z-2 cursor-pointer rounded-full border-none bg-transparent px-4.5 py-2.5 text-sm"
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>

      {/* ทุกภูมิภาคอยู่ใน HTML เสมอ (อ่านได้แม้ JS ไม่ทำงาน)
          key ผูกกับแท็บที่เลือก เพื่อให้ stagger เล่นใหม่ทุกครั้งที่สลับแท็บ */}
      {REGIONS.map((region) => (
        <div
          key={`${region.key}-${active}`}
          role="tabpanel"
          id={region.key === active ? "branch-panel" : undefined}
          aria-labelledby={`tab-${region.key}`}
          hidden={active !== region.key}
          className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
        >
          {region.branches.map((branch, i) => (
            <div
              key={branch.name}
              // เข้ามาแบบ stagger 40ms ต่อรายการเมื่อสลับแท็บ
              style={
                reduced
                  ? undefined
                  : {
                      animation: `kwBranchIn var(--dur-base) var(--ease-out) both`,
                      animationDelay: `${i * 40}ms`,
                    }
              }
              className="group flex gap-3 rounded-2xl bg-white px-5 py-4.5 shadow-[0_6px_18px_rgba(15,16,21,.04)]"
            >
              <span
                aria-hidden="true"
                style={{
                  transitionProperty: "transform",
                  transitionDuration: "var(--dur-base)",
                  transitionTimingFunction: "var(--ease-spring)",
                }}
                className="text-kawai-red group-hover:-translate-y-1 group-hover:scale-115"
              >
                ◉
              </span>
              <div>
                <div className="font-medium">{branch.name}</div>
                <div className="text-[13px] leading-[1.6] text-ink/55">
                  {branch.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
