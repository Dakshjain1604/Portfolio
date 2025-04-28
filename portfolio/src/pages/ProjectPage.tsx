
import { ProjectBento } from "../compoents/subCompoents/ProjectBento";
import { Headerbar } from "../compoents/topBar";
import { ContactBottomBar } from "./Contact";

export function ProjectPage() {
  return (
    <div className="bg-black min-h-screen w-full text-white ">
        <div className="px-4 sm:px-6 md:px-10">
      <Headerbar />
      <div className="text-white flex justify-center items-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold py-4 sm:py-6">
        Project Page
      </div>
      <div className="py-6 sm:py-8 md:py-10 w-full max-w-6xl mx-auto">
        <ProjectBento
          Name=" Brianly "
          GithubLink="https://github.com/Dakshjain1604/Brainly"
          mainImage="src/images/brainlyImages/BrainlyImage.png"
          image1="src/images/brainlyImages/Signup.png"
          image2="src/images/brainlyImages/Add Content.png"
          image3="src/images/istockphoto-1256974410-612x612.jpg"
          description="aslkdfjhslkjfhaslkjfhasdlkfjhasdklfjhasdlkfjhasdlfkjhasdflkjasdhf"
        />
         <ProjectBento
          Name=" Live Tracking"
          GithubLink="https://github.com/Dakshjain1604/Brainly"
          mainImage="src/images/istockphoto-1256974410-612x612.jpg"
          image1="src/images/istockphoto-1256974410-612x612.jpg"
          image2="src/images/istockphoto-1256974410-612x612.jpg"
          image3="src/images/istockphoto-1256974410-612x612.jpg"
          description="aslkdfjhslkjfhaslkjfhasdlkfjhasdklfjhasdlkfjhasdlfkjhasdflkjasdhf"
        />
      </div>
      
    </div>
    <ContactBottomBar/>
    </div>
  );
}