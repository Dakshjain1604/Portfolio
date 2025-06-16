"use client"
import  ExperienceCard  from "../subComponents/ExperienceCard";

export function Experience(){
    return <div className="flex flex-col justify-center items-center mt-20 h-fit px-20">
        <div className="text-6xl font-bold pt-10 pb-15 text-white flex justify-center">Professional Experience </div>
            <div className="flex justify-between gap-10">
            <ExperienceCard 
                title="Backend Development Intern" 
                company="Celebal Technologies" 
                description="During my backend development internship, I built a backend system for an e-commerce platform using Node.js and Express, enhancing overall API performance. I integrated secure JWT authentication, implemented GraphQL APIs, and documented REST APIs using Swagger UI. I also containerized the application with Docker to streamline deployment across different environments."  
                date="(June 2024 – Aug 2024)"
            />
            <ExperienceCard 
                title="Data Science Intern" 
                company="Celebal Technologies" 
                description="At Celebal Technologies, I worked on developing machine learning models for predictive analytics and designed interactive data visualizations using Matplotlib. I optimized data preprocessing pipelines with Python libraries like Pandas and NumPy, making the data preparation process more efficient. I also researched and implemented Transformer models and NLP techniques for AI applications." 
                 
                date="(Oct 2024 – Feb 2025)"
            />
            </div>
    </div>
}


