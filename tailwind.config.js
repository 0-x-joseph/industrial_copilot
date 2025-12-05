/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // OCP Brand Colors
        'primary-dark': '#313647',
        'primary-medium': '#435663', 
        'primary-light': '#A3B087',
        'primary-cream': '#FFF8D4',
        
        // Extended dark theme palette (derived from brand colors)
        'ocp': {
          // Dark backgrounds (based on primary-dark #313647)
          950: '#1a1d24',  // Darkest - main background
          900: '#232730',  // Dark panels
          800: '#2d313c',  // Card backgrounds
          700: '#313647',  // Primary dark (original)
          600: '#3d4254',  // Elevated surfaces
          
          // Medium tones (based on primary-medium #435663)
          500: '#435663',  // Primary medium (original)
          400: '#5a6d7a',  // Borders, dividers
          300: '#7a8b96',  // Muted text
          
          // Light accents (based on primary-light #A3B087)
          'accent': '#A3B087',      // Primary accent (sage green)
          'accent-hover': '#8B9474', // Accent hover state
          'accent-muted': '#A3B08766', // Accent with opacity
          
          // Cream (based on primary-cream #FFF8D4)
          'cream': '#FFF8D4',
          'cream-muted': '#FFF8D4CC',
        },
        
        // Status colors (harmonized with brand)
        'status': {
          'success': '#7CB87C',      // Muted green (harmonizes with sage)
          'success-muted': '#7CB87C33',
          'warning': '#D4A574',      // Warm amber
          'warning-muted': '#D4A57433',
          'danger': '#C47070',       // Muted rose
          'danger-muted': '#C4707033',
          'info': '#7094B0',         // Muted blue
          'info-muted': '#7094B033',
        },
        
        // Semantic mappings
        'background-primary': 'var(--color-background-primary)',
        'background-secondary': 'var(--color-background-secondary)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'border-primary': 'var(--color-border-primary)',
        'icon-primary': 'var(--color-icon-primary)',
        'icon-secondary': 'var(--color-icon-secondary)',
        'icon-accent': 'var(--color-icon-accent)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'ocp-gradient': 'linear-gradient(to bottom right, #313647, #435663)',
        'accent-gradient': 'linear-gradient(to right, #A3B087, #8B9474)',
      },
      boxShadow: {
        'ocp': '0 4px 6px -1px rgba(49, 54, 71, 0.3), 0 2px 4px -1px rgba(49, 54, 71, 0.2)',
        'ocp-lg': '0 10px 15px -3px rgba(49, 54, 71, 0.3), 0 4px 6px -2px rgba(49, 54, 71, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
