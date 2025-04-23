/** @type {import('tailwindcss').Config} */
module.exports = {
     darkMode: ["class"],
     content: [
       "./src/**/*.{js,ts,jsx,tsx,mdx}",
     ],
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
       },
     },
     plugins: [require("tailwindcss-animate"), require("daisyui")],
     daisyui: {
       themes: [
         {
           luxury: {
             "color-base-100": "oklch(14.076% 0.004 285.822)",
             "color-base-200": "oklch(20.219% 0.004 308.229)",
             "color-base-300": "oklch(23.219% 0.004 308.229)",
             "color-base-content": "oklch(75.687% 0.123 76.89)",
             "color-primary": "oklch(100% 0 0)",
             "color-primary-content": "oklch(20% 0 0)",
             "color-secondary": "oklch(27.581% 0.064 261.069)",
             "color-secondary-content": "oklch(85.516% 0.012 261.069)",
             "color-accent": "oklch(36.674% 0.051 338.825)",
             "color-accent-content": "oklch(87.334% 0.01 338.825)",
             "color-neutral": "oklch(24.27% 0.057 59.825)",
             "color-neutral-content": "oklch(93.203% 0.089 90.861)",
             "color-info": "oklch(79.061% 0.121 237.133)",
             "color-info-content": "oklch(15.812% 0.024 237.133)",
             "color-success": "oklch(78.119% 0.192 132.154)",
             "color-success-content": "oklch(15.623% 0.038 132.154)",
             "color-warning": "oklch(86.127% 0.136 102.891)",
             "color-warning-content": "oklch(17.225% 0.027 102.891)",
             "color-error": "oklch(71.753% 0.176 22.568)",
             "color-error-content": "oklch(14.35% 0.035 22.568)",
           },
         },
       ],
     },
   }
   
   