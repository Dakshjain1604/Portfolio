import { motion } from "framer-motion";

interface exp {
  title: string;
  company: string;
  description: string;
  date: string;
}

function ExperienceCard(props: exp) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full max-w-md rounded-xl px-4 md:px-6 pb-6 shadow-2xl shadow-white/50 border-white/80 border-2"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row justify-between py-3 px-4 mt-3 text-lg md:text-xl rounded-xl shadow-md shadow-gray-400/10 mb-4 bg-gradient-to-r from-gray-700/30 to-gray-600/30 border border-gray-500/50"
      >
        <div className="flex flex-wrap items-baseline">
          <div className="font-bold text-white">{props.title}</div>
          <div className="pl-2 text-sm md:text-base text-gray-300">| {props.company}</div>
        </div>
        <div className="text-sm md:text-base mt-2 md:mt-0 text-gray-400">
          {props.date}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="shadow-md shadow-gray-400/10 rounded-xl px-4 md:px-6 pb-4 pt-3 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-500/50"
      >
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-justify text-gray-300 text-sm md:text-base leading-relaxed"
        >
          {props.description}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ExperienceCard;