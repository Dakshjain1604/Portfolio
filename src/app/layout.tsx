import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Headerbar } from "./components/topBar";
import Footer from "./components/Footer";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daksh Jain - Portfolio",
  description: "Personal portfolio website showcasing my projects and skills",
  openGraph: {
    title: "Daksh Jain - Portfolio",
    description: "Personal portfolio website showcasing my projects and skills",
    images: [
      {
        url: "/hero-image.jpg", // Make sure to add your hero section image to the public folder
        width: 1200,
        height: 630,
        alt: "Daksh Jain Portfolio Hero Section",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Headerbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
