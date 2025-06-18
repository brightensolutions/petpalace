import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Changed from ["class"] to "class"
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Custom brand colors that use CSS variables
        brand: {
          primary: "var(--color-brand-primary)",
          secondary: "var(--color-brand-secondary)",
          accent: "var(--color-brand-accent)",
        },
        // Custom primary color system (renamed to avoid conflict)
        "primary-blue": {
          50: "var(--color-primary-blue-50)",
          100: "var(--color-primary-blue-100)",
          200: "var(--color-primary-blue-200)",
          300: "var(--color-primary-blue-300)",
          400: "var(--color-primary-blue-400)",
          500: "var(--color-primary-blue-500)",
          600: "var(--color-primary-blue-600)",
          700: "var(--color-primary-blue-700)",
          800: "var(--color-primary-blue-800)",
          900: "var(--color-primary-blue-900)",
        },
        "primary-orange": {
          50: "var(--color-primary-orange-50)",
          100: "var(--color-primary-orange-100)",
          200: "var(--color-primary-orange-200)",
          300: "var(--color-primary-orange-300)",
          400: "var(--color-primary-orange-400)",
          500: "var(--color-primary-orange-500)",
          600: "var(--color-primary-orange-600)",
          700: "var(--color-primary-orange-700)",
          800: "var(--color-primary-orange-800)",
          900: "var(--color-primary-orange-900)",
        },
        // Keep existing shadcn colors for compatibility
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
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
