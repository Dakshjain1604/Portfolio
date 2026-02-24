import { HeroSection } from "./components/HeroSection";
import { AboutMe } from "./components/AboutPage";
import { Skills } from "./components/Skills";
import { Projects } from "./components/ProjectSection";
import { Experience } from "./components/Experience";
import { GitHubStats } from "./components/GitHubStats";
import { OpenSource } from "./components/OpenSource";
import { Testimonials } from "./components/Testimonials";
import { ContactSection } from "./components/ContactSection";
import { TechCarousel } from "./components/TechCarousel";
import { TerminalSection } from "./components/TerminalSection";
import { BlogSection } from "./components/BlogSection";
import { Achievements } from "./components/Achievements";
import { MarqueeSection } from "@/components/ui/marquee";

export default function Home() {
  return (
    <div className="flex flex-col relative">
      <HeroSection />
      <div className="section-divider" />
      <MarqueeSection />
      <div className="section-divider" />
      <AboutMe />
      <div className="section-divider" />
      <TechCarousel />
      <div className="section-divider" />
      <Skills />
      <div className="section-divider" />
      <Projects />
      <div className="section-divider" />
      <Experience />
      <div className="section-divider" />
      <GitHubStats />
      <div className="section-divider" />
      <OpenSource />
      <div className="section-divider" />
      <TerminalSection />
      <div className="section-divider" />
      <Achievements />
      <div className="section-divider" />
      <Testimonials />
      <div className="section-divider" />
      <BlogSection />
      <div className="section-divider" />
      <ContactSection />
    </div>
  );
}
