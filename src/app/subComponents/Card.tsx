import React, { MouseEventHandler } from "react";
import { GitIcon } from "../icons/GitIcon";
import { Github } from "../icons/github";
import { WebSiteIcon } from "../icons/webisteIcon";
import { Url } from "next/dist/shared/lib/router/router";
import { AI } from "../icons/AI_icon";
import {motion } from "framer-motion"
interface PropsCard {
  name: string;
  imageSrc: string;
  gitHubLink: Url;
  liveLink?: Url;
  AIenabled?:boolean;
  delay:number
}
const Card = (props: PropsCard) => {
  return (
    <motion.div initial={{ opacity: 0, y: -50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{
      type: "spring",
      bounce: 0.4, 
      duration: 0.8, 
      delay: props.delay,
    }}
    viewport={{ once: true }}
    
    
    
    className="bg-gray-950 w-120 h-fit rounded-lg pt-3 border-2 hover:scale-105 cursor-pointer shadow-2xl shadow-white/20 min-h-80 max-w-100 ">
      <div className="flex justify-between border-gray-400 border-1 rounded-md px-3 py-1 mx-3 ">
        <div className="flex p-2 gap-1">
          <div className="text-xl font-bold hover:scale-110 hover:text-blue-300 h-fit">
            {props.name}
          </div>
        </div>
        <div className="flex justify- items-center gap-3 mr-2 py-2">
          <div
            className="hover:-skew-y-6 hover:scale-120 hover:text-blue-400"
            onClick={() => {
              window.open(`${props.gitHubLink}`, "_blank");
            }}
          >
            {" "}
            <Github height={25} width={25} />
          </div>

          {props.liveLink && (
            <div
              className="hover:-skew-y-6 hover:scale-120"
              onClick={() => {
                window.open(`${props.liveLink}`, "_blank");
              }}
            >
              <WebSiteIcon />
            </div>
          )}

          {props.AIenabled && (
            <div className="animate-pulse">
              <AI />
            </div>
          )}
          </div>
        </div>
        <div className="flex justify-evenly flex-col items-center border-gray-400 border-1 rounded-md  px-3 m-3 h-[80%]">
          <div className="flex flex-col justify-center items-center h-fit">
            <img
              src={props.imageSrc}
              className="rounded-md  shadow-white/30 shadow-xl py-2 "
            />
          </div>
        </div>
      </motion.div>
  );
};

export default Card;
