import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Headerbar } from "./components/topBar";
import Footer from "./components/Footer";
import { Metadata } from "next";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { InteractiveBackground } from "@/components/ui/interactive-background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daksh Jain | Full Stack + AI Developer",
  description: "Personal portfolio of Daksh Jain - Full Stack Developer & AI Engineer. Building innovative web applications and AI-powered solutions.",
  keywords: ["Daksh Jain", "Full Stack Developer", "AI Engineer", "Web Developer", "React", "Next.js", "Python", "Portfolio"],
  authors: [{ name: "Daksh Jain" }],
  creator: "Daksh Jain",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dakshjain.dev",
    title: "Daksh Jain | Full Stack + AI Developer",
    description: "Personal portfolio showcasing projects, skills, and experience in full-stack development and AI engineering.",
    siteName: "Daksh Jain Portfolio",
    images: [
      {
        url: "/images/profile.avif",
        width: 1200,
        height: 630,
        alt: "Daksh Jain - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daksh Jain | Full Stack + AI Developer",
    description: "Building innovative web applications and AI-powered solutions",
    images: ["/images/profile.avif"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <LoadingScreen />
        <CustomCursor />
        <ScrollProgress />
        <FloatingParticles />
        <InteractiveBackground />
        <Headerbar />
        <main className="relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
