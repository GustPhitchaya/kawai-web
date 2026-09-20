import { siteConfig } from "@/content";

export function SkipLink() {
  return (
    <a
      href="#main"
      className="bg-brand absolute top-0 -left-[9999px] z-[99] rounded-br-nav px-5 py-3 font-medium text-white focus:left-0"
    >
      {siteConfig.skipLabel}
    </a>
  );
}
