import { HeroSection } from "./components/HeroSection";
// import { HeroSection2 } from "./components/HeroSection2";
import { AboutMe } from "./components/AboutPage";
import { Skills } from "./components/Skills";
import { Projects } from "./components/ProjectSection";
import { Experience } from "./components/Experience";

export default function Home() {
  return (
      <div className="flex flex-col gap-15">
        <HeroSection/>
        {/* <HeroSection2/> */}
        <AboutMe/>
        <Skills/>
        <Projects/>
        <Experience/>
      </div>
  );
}
