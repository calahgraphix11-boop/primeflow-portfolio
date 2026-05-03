import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-gold':    '#F5B800',
        'brand-gold-dk': '#C99600',
        'brand-gold-lt': '#FDD96A',
        'surf-page':     '#f7f7f5',
        'surf-card':     '#ffffff',
        'surf-inset':    '#f0efed',
        'surf-border':   '#e4e4e0',
        'txt-primary':   '#1a1a18',
        'txt-muted':     '#6b6b68',
        'txt-faint':     '#9b9b98',
      },
      fontFamily: {
        sans: ['"Host Grotesk"', 'sans-serif'],
      },
      borderRadius: { '3xl': '1.5rem' },
    },
  },
  plugins: [],
}
export default config
