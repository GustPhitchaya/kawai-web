import Image from "next/image";
import { CONTACT, FOOTER_LINKS } from "@/data/nav";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-18 pb-10 text-white">
      {/* เส้นคลื่นเสียงคั่นขอบบน — เคลื่อนช้ามาก ให้จบสอดคล้องกับ progress bar ที่ navbar */}
      <svg
        viewBox="0 0 2400 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-15 w-[200%] opacity-16 motion-safe:animate-[kwDrift_30s_linear_infinite]"
      >
        <path
          d="M0 30 Q150 4 300 30 T600 30 T900 30 T1200 30 T1500 30 T1800 30 T2100 30 T2400 30"
          fill="none"
          stroke="#DB2A1B"
          strokeWidth="2"
        />
      </svg>

      <div className="mx-auto grid max-w-[1240px] gap-10 px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="mb-4">
            <Image
              src="/kawai-logo.svg"
              alt="KAWAI Music School"
              width={130}
              height={24}
              style={{ width: "auto", height: 24 }}
              className="block invert"
            />
          </div>
          <p className="max-w-[38ch] text-sm leading-[1.8] text-white/55">
            โรงเรียนดนตรีสำหรับเด็กและผู้ใหญ่ ก่อตั้งที่ประเทศญี่ปุ่นปี 1956
          </p>
        </div>

        <nav aria-label="ลิงก์ในหน้า" className="flex flex-col gap-2.5 text-sm">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-white/70 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-2.5 text-sm text-white/70">
          <a href={CONTACT.lineUrl} target="_blank" rel="noopener" className="hover:text-white">
            LINE: {CONTACT.lineId}
          </a>
          <a href={CONTACT.telHref} className="hover:text-white">
            โทร: {CONTACT.tel}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="hover:text-white">
            {CONTACT.email}
          </a>
          <a href={CONTACT.facebook} target="_blank" rel="noopener" className="hover:text-white">
            Facebook
          </a>
          <a href={CONTACT.instagram} target="_blank" rel="noopener" className="hover:text-white">
            Instagram
          </a>
        </div>
      </div>

      <div className="mx-auto mt-11 max-w-[1240px] border-t border-white/8 px-6 pt-5 text-[13px] text-white/40">
        © 2026 KAWAI Music School Thailand
      </div>
    </footer>
  );
}
