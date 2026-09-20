import Image from "next/image";
import { Icon } from "@/components/primitives/icon";
import { footerColumns, siteConfig, socialLinks } from "@/content";

export function SiteFooter() {
  return (
    <footer className="bg-deep text-on-deep-faint border-t border-line-on-deep px-gutter pb-11">
      <div className="mx-auto grid max-w-wrap grid-cols-[1.3fr_1fr_1fr] gap-footer-gap pt-footer pb-[34px] max-dt:grid-cols-2 max-tb:grid-cols-1">
        <div>
          <Image
            src={siteConfig.logo.src}
            alt={siteConfig.logo.alt}
            width={siteConfig.logo.width}
            height={siteConfig.logo.height}
            loading="lazy"
            className="mb-5 h-auto w-[186px] brightness-0 invert"
          />
          <p className="text-[0.92rem] leading-[1.8]">{siteConfig.footerBlurb}</p>
        </div>

        {footerColumns.map((col) => (
          <div key={col.heading}>
            <h4 className="text-label mb-4 font-mono font-medium tracking-[0.2em] text-on-deep-muted uppercase">
              {col.heading}
            </h4>
            {col.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                {...("external" in link && link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="duration-[350ms] ease-kawai block py-[5px] text-[0.93rem] text-on-deep-muted transition-colors hover:text-brand-light"
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-wrap flex-wrap items-center justify-between gap-4 border-t border-line-on-deep pt-[26px] text-[0.84rem] text-on-deep-muted">
        <div>{siteConfig.copyright}</div>
        <div className="flex gap-2.5">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="duration-[400ms] ease-kawai grid size-[38px] place-items-center rounded-full border border-white/38 text-[1.15rem] text-on-deep-muted transition-[color,border-color,transform] hover:-translate-y-0.5 hover:border-brand-light hover:text-brand-light"
            >
              <Icon name={social.icon} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
