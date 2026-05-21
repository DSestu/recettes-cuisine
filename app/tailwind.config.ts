import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F53200',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        gelica: ['gelica', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
