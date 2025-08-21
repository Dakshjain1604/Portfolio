import React from "react";
import { Github } from "../icons/github";
import { WebSiteIcon } from "../icons/webisteIcon";
import { AI } from "../icons/AI_icon";
import { motion } from "framer-motion";
import Image from "next/image";

interface PropsCard {
  name: string;
  imageSrc: string;
  gitHubLink: string;
  liveLink?: string;
  AIenabled?: boolean;
  delay: number;
  techStack?:string;
}

const Card = (props: PropsCard) => {
  return (
    
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
        delay: props.delay,
      }}
      viewport={{ once: true }}
      className="bg-black w-full h-full rounded-lg p-3 border border-gray-700 hover:border-white transition-all duration-300 hover:shadow-lg hover:shadow-white/10 flex flex-col"
    >
      <div className="flex justify-between items-center p-1 mb-3">
        <p className="text-lg sm:text-lg font-semibold text-white max-w-[70%]">
          {props.name}
        </p>
        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:text-gray-300 transition-colors hover:scale-110"
            onClick={() => window.open(props.gitHubLink, "_blank")}
            aria-label="GitHub repository"
          >
            <Github height={22} width={22} />
          </button>

          {props.liveLink && (
            <button
              className="p-1 hover:text-gray-300 transition-colors hover:scale-110"
              onClick={() => window.open(props.liveLink, "_blank")}
              aria-label="Live demo"
            >
              <WebSiteIcon />
            </button>
          )}

          {props.AIenabled && (
            <div className="ml-1">
              <AI/>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex-1 rounded-md overflow-hidden border border-gray-700 h-[200px]">
        <Image
          src={props.imageSrc}
          alt={props.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
          width={400}
          height={225}
        />
      </div>
      <div className="h-12 rounded-md text-sm font-semibold flex items-center justify-center bg-gradient-to-r from-white via-blue-500 to-white text-transparent bg-clip-text">
          {props.techStack}
      </div>
    </motion.div>
    
  );
};

export default Card;
