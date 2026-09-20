import type { Metadata, Viewport } from "next";
import { Prompt, Noto_Sans_Thai, IBM_Plex_Mono } from "next/font/google";
import { EnvLayer } from "@/components/layout/env-layer";
import { MotionProvider } from "@/components/layout/motion-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { StaffProgress } from "@/components/layout/staff-progress";
import { StructuredData } from "@/components/layout/structured-data";
import { IconSprite } from "@/components/primitives/icon-sprite";
import { siteConfig } from "@/content";
import "./globals.css";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-thai",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.ogDescription,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${prompt.variable} ${notoSansThai.variable} ${plexMono.variable}`}
    >
      <body>
        <SkipLink />
        <StructuredData />
        <IconSprite />
        <EnvLayer />
        <MotionProvider>
          <div className="relative z-1">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
          <StaffProgress />
        </MotionProvider>
      </body>
    </html>
  );
}
