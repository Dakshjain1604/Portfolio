import { DownArrow } from "../icons/down";
import { delay, motion } from "motion/react";
const newchanges =
  "flex  justify-center items-center flex-col hover:cursor:fancy ";

export function HeroContent() {
  return (
    <div>
      <div className={`${newchanges}`}>
        <div>
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
            src="src/images/EmojiMovie767265187.mov"
            autoPlay
            muted
            loop
            className="cursor-grab"
          ></motion.video>
        </div>
        <div className="text-white flex flex-col justify-center items-center">
          <div className="text-8xl font-semibold pb-10">Daksh Jain</div>
          <div className="text-2xl align-center  text-center text-white ">
            Welcome! I'm a Full-Stack Web Developer who loves building sleek,
            scalable apps<br></br>check out my work and let's connect!
          </div>
          <DownArrow />
        </div>
        <div></div>
      </div>
    </div>
  );
}
