"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useScrolled } from "@/hooks/use-scrolled";
import { lineCta, navLinks, siteConfig, ui } from "@/content";

export function SiteHeader() {
  const solid = useScrolled(40);
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex items-center gap-[18px] px-gutter py-[14px] max-ph:gap-[10px]",
        "duration-500 ease-kawai transition-[background-color,box-shadow,padding]",
        solid &&
          "bg-canvas/90 shadow-[0_1px_0_var(--color-line)] py-[10px] backdrop-blur-[14px] backdrop-saturate-[1.2]",
      )}
    >
      <a
        href="#home"
        aria-label={ui.homeAriaLabel}
        className="flex flex-none items-center gap-3"
      >
        <Image
          src={siteConfig.logo.src}
          alt={siteConfig.logo.alt}
          width={siteConfig.logo.width}
          height={siteConfig.logo.height}
          priority
          className="h-auto w-[clamp(132px,13vw,178px)] max-ph:w-[118px]"
        />
      </a>

      <nav
        aria-label={ui.navAriaLabel}
        className="ml-auto flex items-center gap-[clamp(10px,1.5vw,24px)] max-nav:hidden"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="group text-ink duration-[350ms] ease-kawai relative py-1.5 text-[0.86rem] font-medium whitespace-nowrap transition-colors hover:text-brand"
          >
            {link.label}
            <span className="bg-brand duration-[450ms] ease-kawai absolute bottom-0.5 left-0 h-[1.5px] w-0 transition-[width] group-hover:w-full" />
          </a>
        ))}
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="rounded-pill border-line-btn ml-auto border-[1.5px] px-[15px] py-[9px] text-[0.85rem] max-ph:px-3 max-ph:py-2 max-ph:text-[0.8rem] nav:hidden"
            aria-label={ui.menuOpenAriaLabel}
          >
            {ui.menuLabel}
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-panel gap-0 p-0">
          <SheetTitle className="border-line border-b px-5 py-4 font-mono text-label tracking-[0.2em] text-brand-ink uppercase">
            {ui.menuLabel}
          </SheetTitle>
          <nav aria-label={ui.navAriaLabel} className="flex flex-col p-[10px]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-nav duration-[350ms] ease-kawai px-[14px] py-3 text-[0.96rem] font-medium transition-colors hover:bg-canvas hover:text-brand"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <Button asChild variant="brand" size="pillSm" className="flex-none">
        <a href={siteConfig.line.url} target="_blank" rel="noopener noreferrer">
          {lineCta.header}
        </a>
      </Button>
    </header>
  );
}
