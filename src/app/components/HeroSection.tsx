"use client";
import { motion } from "framer-motion";
import { BottomBar } from "./BottomBar";
import BlurText from "../subComponents/Title";
export function HeroSection() {
  return (
    <div
      className="flex flex-col h-screen w-screen justify-around items-center"
      id="home"
    >
      <div className="flex justify-evenly">
        <div className="flex flex-col">
          <div className="">
          <BlurText
            text="Daksh Jain"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-9xl mb-8 mt-15 justify-center"
          />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl align-center text-center text-white pt-4 font-serif"
          >
            Welcome! I'm a Full-Stack Web Developer who loves building sleek,
            scalable apps
            <br />
            check out my work and let's connect!
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
          className="cursor-grab -mb-3 "
        />
      </div>
      <BottomBar />
    </div>
  );
}
