import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planboard — AI Activity Generator for Teachers",
  description:
    "Turn lesson goals into classroom-ready activities in seconds. Powered by AI, designed for K-12 teachers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${dmSans.variable} ${geistMono.variable} paper-texture min-h-screen`}
      >
        <AuthProvider initialUser={user}>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
