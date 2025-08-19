"use client"
import { motion } from "framer-motion";

export function AboutMe() {
  return (
    <div className="bg-black text-white mb-20 h-fit" id="about">
      <div className=" flex justify-center items-center text-6xl font-bold hover:scale-110">About Me</div>
      <div className="flex flex-col lg:flex-row justify-evenly items-center px-6 sm:px-10 lg:px-20 gap-10">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-base sm:text-xl pt-10 sm:pt-20 flex flex-col pb-10 sm:pb-20 max-w-3xl"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay:0.3 }}
            viewport={{ once: true }}
            className="text-justify leading-relaxed text-sm sm:text-base md:text-md"
          >
            <p>
  I&apos;m a driven <b>Computer Science undergraduate</b> specializing in <b>Cloud Computing</b> at JECRC University with a solid academic standing (<b>CGPA: 8.3</b>) and a passion for full-stack development. My technical journey has been fueled by real-world experience, including a backend-focused internship at <b>Celebal Technologies</b>, where I built and optimized scalable services and also explored <b>machine learning and AI integrations</b>.
</p>

<p className="pt-4">
  As a <b>full-stack developer</b>, I enjoy building end-to-end solutions — from crafting clean, responsive UIs with <b>React.js, Next.js, and TailwindCSS</b>, to designing secure and efficient backends using <b>Node.js, Express.js, and MongoDB/PostgreSQL</b>. My work includes projects like <b>Transactly</b> (a peer-to-peer payment system) and <b>DrawSync</b> (a real-time collaborative whiteboard), where I handled authentication, state management, sockets, and deployment.
</p>

<p className="pt-4">
  My curiosity extends into <b>AI/ML and developer tooling</b>. I’ve worked on <b>RAG pipelines</b> with <b>LangChain</b> and OpenAI APIs, and I’m currently developing a <b>website generator</b> powered by generative AI. I also bring experience in <b>Python</b>, <b>Scikit-learn</b>, and <b>NLP models</b>, which I apply in personal projects and internships.
</p>

<p className="pt-4">
  I hold <b>Microsoft Azure and Dynamics 365 certifications</b>, and I’m comfortable working in <b>Linux environments</b>, with tools like Docker, GitHub Actions, and Postman. Whether it’s building robust APIs, architecting scalable systems, or creating clean UX, I thrive on solving real problems and learning through building.
</p>

<motion.p 
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.3 }}
  viewport={{ once: true }}
  className="pt-6"
>
  I believe in <b>collaborative engineering</b> and love being part of communities where ideas turn into impact. Whether I’m solving algorithms, deploying features, or experimenting with new tech, I strive to create solutions that are <b>functional, reliable, and user-centric</b>.
</motion.p></motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center items-center"
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src="/images/profile.avif"
            alt="Daksh Jain - Full Stack Developer"
            className="rounded-full w-50 sm:w-66 md:w-80 lg:w-90 h-auto object-cover shadow-xl shadow-gray-600"
          />
        </motion.div>
      </div>
    </div>
  );
}