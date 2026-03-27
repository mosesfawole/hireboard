import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              const theme = localStorage.getItem('hireboard-theme');
              if (theme === 'dark' || !theme) document.documentElement.classList.add('dark');
            } catch(e) {}
          `,
          }}
        />
      </head>
      <body className={`${manrope.variable} ${spaceGrotesk.variable} min-h-screen`}>
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
