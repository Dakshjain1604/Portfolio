import { ExperienceCard } from "./subCompoents/Experience Card";

export function Experience(){
    return <div>
        <div className="text-6xl font-bold pt-10 pb-10 text-white flex justify-center items">Experience</div>
        <div className="flex flex-col">
                <div><ExperienceCard company="celebal Technologies " position="Backend Developement Intern" learning={["i learned the basic of node js backend development and how to build scaleable apps with a robust backend "]}date="June 2024-August-2024" ></ExperienceCard></div>
        </div>
    </div>
}