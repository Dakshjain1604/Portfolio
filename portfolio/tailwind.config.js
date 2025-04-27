/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors:{
        blue:{
          500:"#2D3748",
          200:" #e0eafc",
          300:"#cfdef3",
        },
        orange:{
          500:"#ED8936",
        },
        gray:{
          300:"#1A202C",
        }
      },
      cursor: {
        fancy: 'url("protfolio/public/icons8-cursor-50.png"), auto', // Replace with your image path
      },
      fontFamily: {
        sans: , // default sans
        serif: ['Playfair Display', 'serif'], // default serif
        dancing: ['Dancing Script', 'cursive'],
        limelight: ['Limelight', 'cursive'],
        tagesschrift: ['Tagesschrift', 'cursive'],
        tektur: ['Tektur', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

