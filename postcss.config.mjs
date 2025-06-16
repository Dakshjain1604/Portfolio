const config = {
  plugins: {"@tailwindcss/postcss":{
    theme: {
      extend: {
        fontFamily: {
          'regalia': ['Regalia Monarch', 'sans-serif'], // Or include other fallbacks
        },
      },
    },
  }
  },
};

export default config;
