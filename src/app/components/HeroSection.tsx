"use client";
import { motion } from "framer-motion";
import { BottomBar } from "./BottomBar";
import BlurText from "../subComponents/Title";
export function HeroSection() {
  return (
    <div
      className="flex flex-col h-screen w-screen justify-around items-center px-4 sm:px-6 md:px-8 lg:px-10"
      id="home"
    >
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 lg:gap-16">
        <div className="flex flex-col items-center md:items-center">
          <div className="text-center md:text-center">
            <BlurText
              text="Daksh Jain"
              delay={75}
              animateBy="words"
              direction="top"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl mb-4 md:mb-8 mt-8 md:mt-15 justify-center text-shadow-2xl text-shadow-white"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2}}
            viewport={{ once: true }}
            className="text-base sm:text-lg md:text-xl text-center md:text-center text-blue-100 pt-4 font-serif max-w-xl"
          >
            Welcome! I&apos;m a Full-Stack Web Developer who loves building sleek,
            scalable apps
            <br />
            check out my work and let&apos;s connect!
          </motion.div>
        </div>
        <motion.video
          drag
          whileDrag={{
            scale: 0.8,
          }}
          dragConstraints={{
            left: 30,
            right: 30,
            top: 30,
            bottom: 30,
          }}
          transition={{
            duration: 1,
          }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          src="/images/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="cursor-grab w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-auto -mb-3"
        />
      </div>
      <BottomBar />
    </div>
  );
}
