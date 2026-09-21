import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
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

// One typeface for the whole site — display, body and mono roles all
// point at this single Kanit instance (see globals.css). Weights cover
// every role that used to be split across three families: 400 for
// body copy, 500 for mono labels and medium emphasis, 600/700 for
// headings.
const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kanit",
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
      className={kanit.variable}
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
