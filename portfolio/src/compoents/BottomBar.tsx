import { Github } from "../icons/github";
import { Gmailicon } from "../icons/GmailIcon";
import { Leetcode } from "../icons/Leetcode";
import { Linkedin } from "../icons/linkedin";
import {motion} from "motion/react"
export function BottomBar(){
    return <div className="pt-10 pb-20 flex justify-center items-center  gap-10 md:gap-10 lg:gap-20 ">
        <div onClick={()=>{
          window.open('https://www.linkedin.com/in/daksh-jain16/', '_blank');
        }} className="hover:scale-110"><Linkedin/></div>
        <div className="hover:scale-110" onClick={()=>{
          window.open('https://github.com/Dakshjain1604', '_blank');
        }}><Github height={42} width={42} /></div>
        <div onClick={()=>{
          window.open("https://leetcode.com/u/Daksh8816/","_blank")
        }} className="hover:scale-110 hover:text-red-200"><Leetcode/></div>
        <div onClick={()=>{
          window.open("https://mail.google.com/mail/u/0/#inbox?compose=CllgCJNvMZDCbHbrHplLnvQpFQCgzcbVXzLFxsfvLLjBdfQpCBpMCTsQfgZQknBgQgRTcGWmhsB","_blank");
        }}><Gmailicon/></div>
    </div>
}