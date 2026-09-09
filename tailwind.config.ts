import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff0f3',
          100: '#ffe3e8',
          200: '#fcc9d4',
          300: '#fa9eb3',
          400: '#f6688b',
          500: '#ee3866',
          600: '#db1d52',
          700: '#b81240',
          800: '#99133a',
          900: '#811436',
        },
        babyBlue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          500: '#0ea5e9',
        },
        babyBeige: {
          50: '#fdfbf7',
          100: '#f8f4ec',
          200: '#eedfcc',
        }
      },
      fontFamily: {
        sans: ['var(--font-tajawal)', 'Tajawal', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
