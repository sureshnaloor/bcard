import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'auth-gradient-from': '#ffffff',
        'auth-gradient-to': '#f0f9ff',
        'smart-wave': 'rgba(255, 255, 255, 0.85)',
      },
      backgroundImage: {
        'auth-gradient': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
        'glossy': 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
