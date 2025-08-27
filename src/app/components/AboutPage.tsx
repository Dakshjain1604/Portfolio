"use client"
import { motion } from "framer-motion";

export function AboutMe() {
  return (
    <div className="bg-black text-white py-8 md:py-12" id="about">
      <div className="flex justify-center items-center text-3xl md:text-4xl font-bold mb-6 md:mb-8 hover:scale-105 transition-transform">
        About Me
      </div>
      
      <div className="flex flex-col lg:flex-row justify-center items-center px-4 md:px-8 gap-6 md:gap-8 max-w-6xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex-1 max-w-2xl"
        >
          <div className="text-sm md:text-base text-justify leading-relaxed space-y-3">
            <p>
              I`&apos;`m a <b>Computer Science undergraduate</b> specializing in <b>Cloud Computing</b> at JECRC University (CGPA: 8.3) with backend experience at <b>Celebal Technologies</b>.
            </p>

            <p>
              As a <b>full-stack developer</b>, I build end-to-end solutions using <b>React.js, Next.js, Node.js, Express.js, and MongoDB/PostgreSQL</b>. Key projects include <b>Transactly</b> (P2P payments) and <b>DrawSync</b> (collaborative whiteboard).
            </p>

            <p>
              I work with <b>AI/ML, RAG pipelines, LangChain</b>, and OpenAI APIs. Currently developing an <b>AI-powered website generator</b>. Certified in <b>Microsoft Azure and Dynamics 365</b>.
            </p>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-300"
            >
              I believe in <b>collaborative engineering</b> and creating solutions that are <b>functional, reliable, and user-centric</b>.
            </motion.p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex-shrink-0"
        >
          <motion.img
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            src="/images/profile.avif"
            alt="Daksh Jain - Full Stack Developer"
            className="rounded-full w-32 md:w-48 lg:w-56 h-32 md:h-48 lg:h-56 object-cover shadow-lg shadow-gray-700"
          />
        </motion.div>
      </div>
    </div>
  );
}