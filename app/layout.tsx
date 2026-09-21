import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { TrackingProvider } from "@/context/TrackingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The reference UI is Material/Roboto; self-host it so it does not depend on
// the OS having Roboto (macOS does not) and fall back to Optima.
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "iALERT | Vehicle Path Tracker",
  description: "Responsive vehicle tracking dashboard with playback, filters, and route summary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 font-calibri text-slate-900 flex flex-col">
        <TrackingProvider>
          {children}
        </TrackingProvider>
      </body>
    </html>
  );
}
