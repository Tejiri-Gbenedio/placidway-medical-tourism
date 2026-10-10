import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { APP_NAME, TAGLINE } from "@/config/brand";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: `${APP_NAME} | ITC Knowledge Assistant`,
  description: TAGLINE,
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={openSans.className}>
      <head>
        <meta name="robots" content="noindex,nofollow" />
      </head>
      <body className="min-h-screen flex flex-col bg-page selection:bg-peach-200 selection:text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
