"use client";
import { motion } from "framer-motion";
import { AzureIcon } from "../icons/AzureIcon";
import { Cssicon } from "../icons/css";
import { DockerIcon } from "../icons/DockerIcon";
import { Github } from "../icons/github";
import { GitIcon } from "../icons/GitIcon";
import { GraphhQL } from "../icons/GraphQl";
import { HtmlIcon } from "../icons/Html";
import { JavaScript } from "../icons/JavaScript";
import { MongoDbIcon } from "../icons/MongoDb";
import { MySqlIcon } from "../icons/MySqlIcon";
import { NextjsIcon } from "../icons/Nextjsicon";
import { NodejsIcon } from "../icons/nodejs";
import { PostgreSQL } from "../icons/Postgre";
import { PostManIcon } from "../icons/PostManIcon";
import { PrismIcon } from "../icons/primsaicon";
import { PythonIcon } from "../icons/PythonIcon";
import { Reactlogo } from "../icons/ReactIcon";
import { RedisIcon } from "../icons/RedisIcon";
import { SwaggerIcon } from "../icons/SwaggerIcon";
import { TailwindIcon } from "../icons/Tailwindcss";
import { TypeScriptIcon } from "../icons/TypeScriptIcon";
import { ZodIcon } from "../icons/ZodIcon";
import { Brain, Link2, Database, Server, Code, Wrench } from "lucide-react";

interface Skill {
  name: string;
  icon: React.ReactNode;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: Skill[];
}

const categories: SkillCategory[] = [
  {
    title: "Frontend",
    icon: <Code size={14} />,
    skills: [
      { name: "HTML", icon: <HtmlIcon /> },
      { name: "CSS", icon: <Cssicon /> },
      { name: "JavaScript", icon: <JavaScript /> },
      { name: "TypeScript", icon: <TypeScriptIcon /> },
      { name: "React", icon: <Reactlogo /> },
      { name: "Next.js", icon: <NextjsIcon /> },
      { name: "Tailwind", icon: <TailwindIcon /> },
    ],
  },
  {
    title: "Backend",
    icon: <Server size={14} />,
    skills: [
      { name: "Node.js", icon: <NodejsIcon /> },
      { name: "Python", icon: <PythonIcon /> },
      { name: "GraphQL", icon: <GraphhQL /> },
      { name: "Prisma", icon: <PrismIcon /> },
      { name: "Zod", icon: <ZodIcon /> },
    ],
  },
  {
    title: "Databases",
    icon: <Database size={14} />,
    skills: [
      { name: "MongoDB", icon: <MongoDbIcon /> },
      { name: "PostgreSQL", icon: <PostgreSQL /> },
      { name: "MySQL", icon: <MySqlIcon /> },
      { name: "Redis", icon: <RedisIcon /> },
    ],
  },
  {
    title: "DevOps & Tools",
    icon: <Wrench size={14} />,
    skills: [
      { name: "Docker", icon: <DockerIcon /> },
      { name: "Azure", icon: <AzureIcon /> },
      { name: "Git", icon: <GitIcon /> },
      { name: "GitHub", icon: <Github height={18} width={18} /> },
      { name: "Postman", icon: <PostManIcon /> },
      { name: "Swagger", icon: <SwaggerIcon /> },
    ],
  },
  {
    title: "AI/ML",
    icon: <Brain size={14} />,
    skills: [
      { name: "OpenAI APIs", icon: <Brain size={18} className="text-neutral-400" /> },
      { name: "LangChain", icon: <Link2 size={18} className="text-neutral-400" /> },
      { name: "RAG Pipelines", icon: <Database size={18} className="text-neutral-400" /> },
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Skills() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#09090b]" id="skills">
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <div className="section-divider mt-4" />
        </motion.div>

        <div className="space-y-8">
          {categories.map((category, catIdx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-cyan-400">{category.icon}</span>
                <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
                  {category.title}
                </h3>
              </div>
              
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2"
              >
                {category.skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    variants={item}
                    whileHover={{ y: -4 }}
                    className="glass-card rounded-lg p-3 flex flex-col items-center gap-2 cursor-default group"
                  >
                    <div className="[&>svg]:w-5 [&>svg]:h-5 text-neutral-500 group-hover:text-white transition-colors duration-300">
                      {skill.icon}
                    </div>
                    <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400 transition-colors text-center leading-tight">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
