import type { Metadata } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "HireBoard — Find Your Next Opportunity",
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
        {/* 
          This script runs before React loads.
          It reads the saved theme from localStorage and applies 
          the 'dark' class to the html element immediately —
          preventing a flash of the wrong theme on page load.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('hireboard-theme');
                if (theme === 'dark' || !theme) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${syne.variable} ${jetbrains.variable} font-mono min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
