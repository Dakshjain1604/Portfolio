
import { ExperienceCard } from "./subCompoents/Experience Card";



export function Experience(){
    return <div className="flex flex-col px-20 pb-20">
        <div className="text-6xl font-bold pt-10 pb-15 text-gray-200 flex justify-center">Experience </div>
            <ExperienceCard title="Backend Development Intern" company="Celebal Technologies" description="During my backend development internship, I built a backend system for an e-commerce platform using Node.js and Express, enhancing overall API performance. I integrated secure JWT authentication, implemented GraphQL APIs, and documented REST APIs using Swagger UI. I also containerized the application with Docker to streamline deployment across different environments." image="src/images/celebaltech.png" date="(June 2024 – Aug 2024)"></ExperienceCard>
    </div>
}