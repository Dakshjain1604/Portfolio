"use client"
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
import { SkillBox } from "../subComponents/SkillButton";
import { motion } from "framer-motion";

export function Skills() {
  return (
    <div className="">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-6xl font-bold pt-10 pb-10  flex justify-center hover:scale-110  "
      >
        Skills
      </motion.h2>
      <div className="flex flex-col justify-center px-2 sm:px-4 md:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 sm:gap-5 pb-5"
        >
          <SkillBox logo={<HtmlIcon />} text="Html" />
          <SkillBox logo={<Cssicon />} text="CSS" />
          <SkillBox logo={<JavaScript />} text="JavaScript" />
          <SkillBox logo={<PythonIcon />} text="Python" />
          <SkillBox logo={<NodejsIcon />} text="Node js" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 sm:gap-5 pb-5"
        >
          <SkillBox logo={<Reactlogo />} text="React js" />
          <SkillBox logo={<TypeScriptIcon />} text="TypeScript" />
          <SkillBox logo={<MySqlIcon />} text="My SQL" />
          <SkillBox logo={<MongoDbIcon />} text="Mongo DB" />
          <SkillBox logo={<RedisIcon />} text="Redis" />
          <SkillBox logo={<AzureIcon />} text="Azure" />
          <SkillBox logo={<DockerIcon />} text="Docker" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 sm:gap-5 pb-5"
        >
          <SkillBox logo={<GraphhQL />} text="GraphQl" />
          <SkillBox logo={<PostManIcon />} text="PostMan" />
          <SkillBox logo={<SwaggerIcon />} text="Swagger UI" />
          <SkillBox logo={<GitIcon />} text="Git" />
          <SkillBox logo={<Github height={25} width={25} />} text="GitHub" />
          <SkillBox logo={<NextjsIcon />} text="Next js" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 sm:gap-5 pb-5"
        >
          <SkillBox logo={<ZodIcon />} text="Zod" />
          <SkillBox logo={<TailwindIcon />} text="Tailwind CSS" />
          <SkillBox logo={<PrismIcon />} text="Prisma" />
          <SkillBox logo={<PostgreSQL />} text="PostgreSQL" />
        </motion.div>
      </div>
    </div>
  );
}
