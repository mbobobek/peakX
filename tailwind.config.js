/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        success: '#22C55E',
        warning: '#FACC15',
        danger: '#EF4444',
        accent: '#A855F7',
        surface: '#F8FAFC',
        muted: '#94A3B8',
        'dark-bg': '#0F172A',
        'dark-surface': '#1E293B',
      },
    },
  },
  plugins: [],
}
