"use client";
import { motion } from "framer-motion";
import { Github } from "../icons/github";
import { Gmail } from "../icons/Gmail";
import { Leetcode } from "../icons/Leetcode";
import { Linkedin } from "../icons/Linkedin";

const socials = [
  {
    icon: <Linkedin />,
    href: "https://www.linkedin.com/in/daksh-jain16/",
    label: "LinkedIn",
    hoverColor: "hover:text-blue-400",
    glowColor: "group-hover:shadow-blue-500/20",
  },
  {
    icon: <Github height={38} width={38} />,
    href: "https://github.com/Dakshjain1604",
    label: "GitHub",
    hoverColor: "hover:text-white",
    glowColor: "group-hover:shadow-white/10",
  },
  {
    icon: <Leetcode />,
    href: "https://leetcode.com/u/Daksh8816/",
    label: "LeetCode",
    hoverColor: "hover:text-amber-400",
    glowColor: "group-hover:shadow-amber-500/20",
  },
  {
    icon: <Gmail />,
    href: "mailto:dakshjain8816@gmail.com",
    label: "Email",
    hoverColor: "hover:text-red-400",
    glowColor: "group-hover:shadow-red-500/20",
  },
];

export function BottomBar() {
  return (
    <div className="flex justify-center items-center gap-6 md:gap-10">
      {socials.map((social, i) => (
        <motion.a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            bounce: 0.4,
            duration: 0.6,
            delay: i * 0.1,
          }}
          viewport={{ once: true }}
          whileHover={{ y: -6, scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className={`text-neutral-500 ${social.hoverColor} transition-all duration-300 group relative`}
          aria-label={social.label}
        >
          <div className={`absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity ${social.glowColor}`} />
          <div className="relative">{social.icon}</div>
        </motion.a>
      ))}
    </div>
  );
}
