import { Playfair_Display } from 'next/font/google';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          regalia: ['"Regalia Monarch"', 'serif'],
          Playfair_Display:["Playfair_Display"]
        },
      },
    },
    plugins: [],
  };
  