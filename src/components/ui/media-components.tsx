"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VideoShowcaseProps {
  src: string;
  poster?: string;
  title?: string;
}

export function VideoShowcase({ src, poster, title }: VideoShowcaseProps) {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative group rounded-2xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent z-10 pointer-events-none" />
      
      <video
        src={src}
        poster={poster}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20">
        {title && (
          <span className="text-sm text-white font-medium">{title}</span>
        )}
        
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-cyan-500/5 z-10 pointer-events-none"
      />
    </motion.div>
  );
}

export function ImageGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl overflow-hidden aspect-video"
      >
        <img
          src={images[activeIndex].src}
          alt={images[activeIndex].alt}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveIndex(i)}
            className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
              i === activeIndex ? "border-cyan-500" : "border-transparent"
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
