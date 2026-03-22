"use client";

import { HeroSection } from "./components/HeroSection";
import { AboutMe } from "./components/AboutPage";
import { Skills } from "./components/Skills";
import { Projects } from "./components/ProjectSection";
import { Experience } from "./components/Experience";
import { GitHubStats } from "./components/GitHubStats";
import { TerminalSection } from "./components/TerminalSection";
import { ContactSection } from "./components/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col relative overflow-hidden">
      <HeroSection />
      <div className="section-divider" />
      <AboutMe />
      <div className="section-divider" />
      <Skills />
      <div className="section-divider" />
      <Projects />
      <div className="section-divider" />
      <Experience />
      <div className="section-divider" />
      <GitHubStats />
      <div className="section-divider" />
      <TerminalSection />
      <div className="section-divider" />
      <ContactSection />
    </div>
  );
}
