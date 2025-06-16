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
              I&apos;m a passionate <b> Computer Science undergraduate </b> specializing in 
              <b> Cloud Computing </b> at JECRC University, with a strong 
              <b> 8.3 CGPA </b> and hands-on experience in 
              <b> full-stack development </b>. My journey in tech has been shaped by 
              <b> real-world internships </b> at <b> Celebal Technologies </b>, where I&apos;ve worked on both 
              <b> backend development </b> and <b> data science projects </b>, gaining expertise in building 
              <b> scalable web applications </b> and <b> machine learning solutions </b>.
            </p>

            <p className="pt-4">
              As a <b> full-stack developer </b>, I specialize in creating 
              <b> secure, scalable applications </b> using modern technologies including 
              <b> React.js, Node.js, Express </b>, and various databases like <b> MongoDB and PostgreSQL </b>. 
              My technical toolkit spans from frontend frameworks and responsive design to 
              <b> backend APIs, authentication systems </b>, and containerization with 
              <b> Docker </b>. I&apos;ve successfully delivered projects like 
              <b> Transactly </b>, a secure payment transfer application, and developed 
              interactive portfolio websites that showcase my commitment to <b> clean code </b> and 
              <b> user experience </b>.
            </p>

            <p className="pt-4">
              Beyond development, I bring valuable experience in <b> data science and machine learning </b>, 
              having worked with <b> Python, Scikit-learn, and NLP models </b> during my recent internship. 
              I&apos;m currently learning <b> Generative AI </b> and implementing it into my projects, including a 
              <b> website clone generator </b> that demonstrates AI-powered development tools. 
              This diverse skill set, combined with my <b> 5× Microsoft Azure certifications </b>, 
              positions me uniquely to tackle complex technical challenges across different domains.
            </p>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5,delay:0.3 }}
              viewport={{ once: true }}
              className="pt-6"
            >
              I&apos;m driven by the opportunity to <b> transform ideas into reliable, impactful solutions </b> and 
              thrive in <b> collaborative environments </b> where I can contribute to meaningful projects. 
              Whether it&apos;s building <b> robust APIs </b>, creating 
              <b> intuitive user interfaces </b>, or exploring 
              <b> cutting-edge technologies </b>, I&apos;m always eager to learn and deliver 
              <b> excellence in every project </b> I undertake.
            </motion.p>
          </motion.div>
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