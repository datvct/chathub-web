import type { Config } from "tailwindcss"

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		// "./node_modules/flowbite/**/*.js",
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		},
		screens: {
			sm: '768px',
			md: '960px',
			lg: '1180px',
			xl: '1280px',
			'2xl': '1440px'
		},
		fontSize: {
			'2.5': '0.625rem',
			'2.75': '0.6875rem',
			'3.25': '0.8125rem',
			'3.75': '0.9375rem',
			'4.25': '1.0625rem',
			'4.75': '1.1875rem',
			'22': '5.5rem'
		},
		lineHeight: {
			'3.3275': '0.831875rem',
			'3.6': '0.9rem',
			'3.63': '0.9075rem',
			'3.75': '0.9375rem',
			'3.9325': '0.983125rem',
			'4.2': '1.05rem',
			'4.235': '1.05875rem',
			'4.25': '1.0625rem',
			'4.5': '1.125rem',
			'4.75': '1.1875rem',
			'4.8': '1.2rem',
			'4.84': '1.21rem',
			'5.25': '1.3125rem',
			'5.4': '1.35rem',
			'6.25': '1.5625rem',
			'6.6': '1.65rem',
			'6.5': '1.625rem',
			'7.2': '1.8rem',
			'15': '3.75rem',
			'30.58': '7.645rem'
		},
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// require('flowbite/plugin')
	],
} satisfies Config;
