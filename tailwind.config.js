/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme"
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        ms100: ["Montserrat_100Thin"],
        ms200: ["Montserrat_200ExtraLight"],
        ms300: ["Montserrat_300Light"],
        ms400: ["Montserrat_400Regular"],
        ms500: ["Montserrat_500Medium"],
        ms600: ["Montserrat_600SemiBold"],
        ms700: ["Montserrat_700Bold"],
        ms800: ["Montserrat_800ExtraBold"],
        ms900: ["Montserrat_900Black"],
        ms100i: ["Montserrat_100Thin_Italic"],
        ms200i: ["Montserrat_200ExtraLight_Italic"],
        ms300i: ["Montserrat_300Light_Italic"],
        ms400i: ["Montserrat_400Regular_Italic"],
        ms500i: ["Montserrat_500Medium_Italic"],
        ms600i: ["Montserrat_600SemiBold_Italic"],
        ms700i: ["Montserrat_700Bold_Italic"],
        ms800i: ["Montserrat_800ExtraBold_Italic"],
        ms900i: ["Montserrat_900Black_Italic"],

      }
    },
  },
  plugins: [],
};