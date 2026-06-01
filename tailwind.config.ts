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
        // Krem / Arka Planlar
        cream: {
          50: "#FDFAF4",
          100: "#FAF5E8",
          200: "#F5EDD3",
          DEFAULT: "#FAF5E8",
        },
        
        // Altın / Aksanlar
        gold: {
          50: "#FDF9EE",
          100: "#F9EDCC",
          200: "#F2D98A",
          300: "#E8C14E",
          400: "#D4A829",
          500: "#B8911E",
          600: "#9A7818",
          DEFAULT: "#D4A829",
          light: "#E8C14E",
          dark: "#B8911E",
          muted: "#C9A84C",
        },

        // Charcoal / Metin
        charcoal: {
          50: "#F5F5F5",
          100: "#E8E8E8",
          200: "#C8C8C8",
          300: "#A0A0A0",
          400: "#787878",
          500: "#545454",
          600: "#383838",
          700: "#242424",
          800: "#161616",
          900: "#0A0A0A",
          DEFAULT: "#161616",
        },

        // Warm Gray
        "warm-gray": {
          50: "#FAF9F7",
          100: "#F2F0EC",
          200: "#E4E0D8",
          300: "#D0CABF",
          400: "#B8B0A3",
          500: "#9E9589",
          600: "#847A6E",
          700: "#6A6056",
          800: "#504840",
          900: "#38322C",
          DEFAULT: "#9E9589",
        },

        // Ivory / Açık Arka Plan
        ivory: {
          50: "#FFFFFF",
          100: "#FEFEFE",
          200: "#FCFAF7",
          300: "#F8F4EE",
          DEFAULT: "#F8F4EE",
        },

        // Obsidian / Koyu
        obsidian: {
          DEFAULT: "#0D0D0D",
          soft: "#111111",
          light: "#1A1A1A",
        },

        // Rose Gold
        "rose-gold": {
          100: "#F9E8E3",
          200: "#F0C8BC",
          300: "#E4A494",
          400: "#D4806C",
          500: "#C0624C",
          DEFAULT: "#D4806C",
        },
      },

      fontFamily: {
        display: ["var(--font-display, Georgia)", "serif"],
        sans: ["var(--font-sans, system-ui)", "sans-serif"],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },

      fontWeight: {
        300: "300",
        400: "400",
        500: "500",
        600: "600",
      },

      boxShadow: {
        "gold-sm": "0 1px 4px 0 rgba(212, 168, 41, 0.15)",
        "gold": "0 4px 16px 0 rgba(212, 168, 41, 0.2)",
        "gold-lg": "0 8px 32px 0 rgba(212, 168, 41, 0.25)",
        "gold-xl": "0 16px 48px 0 rgba(212, 168, 41, 0.3)",
        "card": "0 1px 3px 0 rgba(22,22,22,0.06), 0 4px 12px 0 rgba(22,22,22,0.06)",
        "card-hover": "0 8px 30px 0 rgba(22,22,22,0.12)",
      },

      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "gold-pulse": "goldPulse 2s ease-in-out infinite",
      },

      aspectRatio: {
        product: "3 / 4",
      },
    },
  },
  plugins: [],
};

export default config;
