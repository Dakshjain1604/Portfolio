"use client";
import { useState } from "react";
import { HeroSection } from "./components/HeroSection";
import { AboutMe } from "./components/AboutPage";
import { Skills } from "./components/Skills";
import { FeaturedProjects as Projects } from "./components/FeaturedProjects";
import { Experience } from "./components/Experience";
import { GitHubStats } from "./components/GitHubStats";
import { TerminalSection } from "./components/TerminalSection";
import { ContactSection } from "./components/ContactSection";

export default function Home() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const handleSelectSkill = (skill: string) => {
    if (selectedSkill?.toLowerCase() === skill.toLowerCase()) {
      setSelectedSkill(null);
    } else {
      setSelectedSkill(skill);
      // Smooth scroll to projects section
      setTimeout(() => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  const handleClearSkill = () => {
    setSelectedSkill(null);
  };

  return (
    <div className="flex flex-col relative overflow-hidden bg-background">
      <HeroSection />
      <AboutMe />
      <Skills selectedSkill={selectedSkill} onSelectSkill={handleSelectSkill} />
      <Projects 
        selectedSkill={selectedSkill} 
        onClearSkill={handleClearSkill} 
        onSelectSkill={handleSelectSkill} 
      />
      <Experience />
      <GitHubStats />
      <TerminalSection />
      <ContactSection />
    </div>
  );
}
