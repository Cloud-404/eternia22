import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SocialBadges from "@/components/SocialBadges";

const serifFont = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Eternia | Authentic Stories & Mental Wellness",
  description: "A premium editorial publication validating student mental wellness through trauma-informed storytelling, expert psychology insights, and safe anonymous confessions.",
  metadataBase: new URL("https://eternia-blogs.vercel.app"),
  openGraph: {
    title: "Eternia | Student Mental Wellness Publication",
    description: "Validating student mental wellness through trauma-informed storytelling and safe anonymous confessions.",
    url: "https://eternia-blogs.vercel.app",
    siteName: "Eternia",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eternia | Student Mental Wellness Publication",
    description: "Validating student mental wellness through trauma-informed storytelling and safe anonymous confessions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${serifFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground relative">
        {children}
        <SocialBadges />
      </body>
    </html>
  );
}
