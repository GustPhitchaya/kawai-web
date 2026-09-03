import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai, Prompt } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KAWAI Music School Thailand | โรงเรียนดนตรีคาไว",
  description:
    "โรงเรียนดนตรี KAWAI Music School ประเทศไทย คอร์สดนตรีสำหรับเด็กและผู้ใหญ่ 12 สาขาทั่วประเทศ จองคลาสเรียนทดลองผ่าน LINE",
  openGraph: {
    title: "KAWAI Music School Thailand | โรงเรียนดนตรีคาไว",
    description:
      "ไม่ใช่แค่การเรียนดนตรี แต่เป็นการเรียนรู้ ‘ผ่าน’ เสียงดนตรี — คอร์สสำหรับเด็กและผู้ใหญ่ 12 สาขาทั่วประเทศ",
    type: "website",
    locale: "th_TH",
    siteName: "KAWAI Music School Thailand",
  },
  icons: { icon: "/kawai-logo.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#DB2A1B",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} ${prompt.variable}`}>
      <body>{children}</body>
    </html>
  );
}
