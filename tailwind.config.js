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
    },
  },
  plugins: [],
}