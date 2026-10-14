export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#f4f6fa',
          100: '#e7ebf3',
          200: '#c9d2e3',
          300: '#9caccb',
          400: '#687fae',
          500: '#476194',
          600: '#374d7b',
          700: '#2b3b5e',
          800: '#1c2942',
          900: '#0f1b33',
          950: '#080e1c',
        },
        brand: {
          50: '#eff5ff',
          100: '#dbe8fe',
          200: '#bfd7fe',
          300: '#93bbfd',
          400: '#6096fa',
          500: '#3b76f6',
          600: '#2559eb',
          700: '#1d46d8',
          800: '#1e3caf',
          900: '#1e378a',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 27 51 / 0.04), 0 1px 3px 0 rgb(15 27 51 / 0.06)',
        raised: '0 4px 12px -2px rgb(15 27 51 / 0.08), 0 2px 4px -2px rgb(15 27 51 / 0.06)',
        pop: '0 12px 32px -8px rgb(15 27 51 / 0.18), 0 4px 8px -4px rgb(15 27 51 / 0.08)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
}
