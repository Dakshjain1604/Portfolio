import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Wallpaper.tsx requests quality={90} - Next 16 validates against this
    // list rather than allowing any value, and the default is [75] alone.
    qualities: [75, 90],
  },
};

export default nextConfig;
