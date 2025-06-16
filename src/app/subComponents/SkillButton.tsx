'use client'
import { ReactElement } from "react";
import { motion } from "framer-motion";

interface Skills {
    logo: ReactElement,
    text: string,
}

export function SkillBox(props: Skills) {
    return <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.5 }
        }}
        drag 
        dragConstraints={{
            top: 2,
            bottom: 2,
            left: 2,
            right: 2
        }}
        className=" opacity-30 flex flex-row rounded-3xl shadow-lg shadow-gray-700  text-white sm:w-fit h-fit justify-center items-center p-2 md:p-4 gap-3 border-white/20 border-1"
    >
        <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center w-8 h-8"
        >
            {props.logo}
        </motion.div>
        <motion.div 
            whileHover={{ scale: 1.1 }}
            className="text-xs sm:text-lg whitespace-nowrap"
        >
            {props.text}
        </motion.div>
    </motion.div>
}



