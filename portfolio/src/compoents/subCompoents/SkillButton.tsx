import { ReactElement } from "react";
import {motion} from "motion/react"
interface Skills{
    logo:ReactElement,
    text:string,
}

export function SkillBox(props:Skills){
    return <motion.div animate={{y:[0,10,10,0]} } drag dragConstraints  ={{
        top:2,
        bottom:2,
        left:2,
        right:2
    }}
    className=" flex flex-row rounded-3xl shadow-lg shadow-gray-800 bg-black text-white sm:w-fit h-fit justify-center items-center p-4 ">
        <div className="pr-3">{props.logo}</div><div className="text-xs sm:text-lg">{props.text}</div>
    </motion.div>
}



