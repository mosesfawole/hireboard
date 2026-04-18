import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "HireBoard - Find Your Next Opportunity",
  description:
    "Browse hundreds of jobs across all industries. Post jobs, find talent.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              const theme = localStorage.getItem('hireboard-theme');
              if (theme === 'dark' || !theme) document.documentElement.classList.add('dark');
            } catch (error) {}
          `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <div className="app-backdrop" aria-hidden="true">
          <div className="mesh-orb mesh-orb-one" />
          <div className="mesh-orb mesh-orb-two" />
          <div className="mesh-grid" />
        </div>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
