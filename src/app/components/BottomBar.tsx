"use client"
import {motion} from 'framer-motion';
import { Github } from "../icons/github";
import { Gmail } from '../icons/Gmail';
import { Leetcode } from "../icons/Leetcode";
import { Linkedin } from "../icons/Linkedin";

export function BottomBar(){
    return <div className="pb-20 flex justify-center items-center  gap-10 md:gap-10 lg:gap-20 bottom-0 ">

        <motion.div 
        
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0  }}
        transition={{
          type: "spring",
          bounce: 0.4, 
          duration: 0.8, 
          delay: 0.1,
        }}
        viewport={{ once: true }}

        
        onClick={()=>{
          window.open('https://www.linkedin.com/in/daksh-jain16/', '_blank');
        }} className="hover:scale-110 hover:rotate-15"><Linkedin/></motion.div>

        <motion.div 
           initial={{ opacity: 0, y: -50 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{
            type: "spring",
            bounce: 0.4, 
            duration: 0.8, 
            delay: 0.2,
          }}
           viewport={{ once: true }}
        
        
        
        className="hover:scale-110 hover:rotate-15" onClick={()=>{
          window.open('https://github.com/Dakshjain1604', '_blank');
        }}><Github height={42} width={42} /></motion.div>

        <motion.div 
           initial={{ opacity: 0, y: -50 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{
            type: "spring",
            bounce: 0.4, 
            duration: 0.8, 
            delay: 0.3,
          }}
           viewport={{ once: true }}
        
        
        
        
        onClick={()=>{
          window.open("https://leetcode.com/u/Daksh8816/","_blank")
        }} className="hover:scale-110 hover:rotate-15"><Leetcode/></motion.div>

        <motion.div 
        
        initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  bounce: 0.4, 
                  duration: 0.8, 
                  delay: 0.4,
                }}
                viewport={{ once: true }}
        
        className="hover:scale-105 hover:rotate-15 "onClick={()=>{
          window.open("https://mail.google.com/mail/u/0/#inbox?compose=CllgCJNvMZDCbHbrHplLnvQpFQCgzcbVXzLFxsfvLLjBdfQpCBpMCTsQfgZQknBgQgRTcGWmhsB","_blank");
        }}><Gmail/></motion.div>

    </div>
}