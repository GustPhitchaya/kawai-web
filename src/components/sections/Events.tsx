import { EVENTS } from "@/data/events";

/* MOCK DATA: รอข้อมูลอีเวนท์จริงจาก KAWAI */
export function Events() {
  return (
    <section id="events" className="bg-ink py-24 text-white">
      <div className="mx-auto max-w-[1240px] px-6">
        <h2 className="mb-10 font-display text-[clamp(26px,3vw,40px)] font-semibold text-white">
          กิจกรรมและอีเวนท์
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          {EVENTS.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-[20px] border border-white/8 bg-white/4"
            >
              {/* placeholder แบบไฟเวทีกวาดผ่านเมื่อ hover */}
              <div className="relative h-[170px] overflow-hidden bg-[rgb(28,29,36)]">
                <div
                  aria-hidden="true"
                  style={{
                    background: item.sweep,
                    transitionProperty: "transform",
                    transitionDuration: "700ms",
                    transitionTimingFunction: "var(--ease-out)",
                  }}
                  className="absolute -top-[60%] -left-[40%] h-[220%] w-[180%] [transform:rotate(-14deg)] group-hover:[transform:rotate(10deg)_translateX(6%)]"
                />
              </div>
              <div className="p-6.5">
                <div className="mb-2.5 text-xs tracking-[.14em] text-kawai-red uppercase">
                  {item.period}
                </div>
                <h3 className="mb-2.5 font-display text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-[1.8] text-white/62">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
