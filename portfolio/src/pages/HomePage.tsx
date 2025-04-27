import { Headerbar } from "../compoents/topBar";
import { HeroContent } from "../compoents/HeroSectiont";
import { BottomBar } from "../compoents/BottomBar";
import { Projects } from "../compoents/Projects";
import { Skills } from "../compoents/Skills";
import { ContactBottomBar } from "./Contact";
import { Experience } from "../compoents/Experience"


export function HomePage() {
    return <>
        <div className="h-full flex flex-col bg-black text-white">
            <Headerbar/>
            <HeroContent/>
            <BottomBar/>
            <Projects/>
            <Skills/>
            <Experience/>
            <ContactBottomBar/>
        </div>
    </>
}
  


