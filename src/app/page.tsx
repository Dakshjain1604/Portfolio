
import { HeroSection } from "./components/HeroSection";
import { AboutMe } from "./components/AboutPage";
import { BottomBar } from "./components/BottomBar";
import { SkillBox } from "./subComponents/SkillButton";
import { Skills } from "./components/Skills";
import { Projects } from "./components/ProjectSection";
import { Experience } from "./components/Experience";
export default function Home() {
  return (
      <div className="flex flex-col gap-15">
        <HeroSection/>
        <AboutMe/>
        <Skills/>
        <Projects/>
        <Experience/>
      </div>
  );
}
