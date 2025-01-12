import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    screens: {
      sm: "768px",
      md: "960px",
      lg: "1180px",
      xl: "1280px",
      "2xl": "1440px",
    },
    fontSize: {
      "2.5": "0.625rem", // 10px
      "2.75": "0.6875rem", // 11px
      "3.25": "0.8125rem", // 13px
      "3.75": "0.9375rem", // 15px
      "4.25": "1.0625rem", // 17px
      "4.75": "1.1875rem", // 19px
      "22": "5.5rem", // 22px
    },
    lineHeight: {
      "3.3275": "0.831875rem", // 13.31px
      "3.6": "0.9rem", // 14.4px
      "3.63": "0.9075rem", // 14.52px
      "3.75": "0.9375rem", // 15px
      "3.9325": "0.983125rem", // 15.73px
      "4.2": "1.05rem", // 16.8px
      "4.235": "1.05875rem", // 16.94px
      "4.25": "1.0625rem", // 17px
      "4.5": "1.125rem", // 18px
      "4.75": "1.1875rem", // 19px
      "4.8": "1.2rem", // 19.2px
      "4.84": "1.21rem", // 19.36px
      "5.25": "1.3125rem", // 21px
      "5.4": "1.35rem", // 21.6px
      "6.25": "1.5625rem", // 25px
      "6.6": "1.65rem", // 26.4px
      "6.5": "1.625rem", // 26px
      "7.2": "1.8rem", // 28.8px
      "15": "3.75rem", // 60px
      "30.58": "7.645rem", // 122.32px
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
  },
  plugins: [],
} satisfies Config;
