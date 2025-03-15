/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0ffe6',
          100: '#e0ffcc',
          200: '#c2ff99',
          300: '#a3ff66',
          400: '#85ff33',
          500: '#66ff00',
          600: '#52cc00',
          700: '#3d9900',
          800: '#296600',
          900: '#143300',
        },
        accent: {
          50: '#fffde6',
          100: '#fffacc',
          200: '#fff599',
          300: '#fff066',
          400: '#ffeb33',
          500: '#ffe600',
          600: '#ccb800',
          700: '#998a00',
          800: '#665c00',
          900: '#332e00',
        },
        text: {
          primary: '#1a1a1a',
          secondary: '#4d4d4d',
          muted: '#808080',
          light: '#ffffff',
          dark: '#000000',
        },
        background: {
          light: '#ffffff',
          subtle: '#f7f9fc',
          muted: '#edf2f7',
        },
        border: {
          light: '#e6e6e6',
          normal: '#cccccc',
          dark: '#999999',
        },
      },
      backgroundColor: {
        'page': '#ffffff',
        'card': '#f7f9fc',
        'input': '#edf2f7',
      },
      textColor: {
        'inverted': '#ffffff',
      },
    },
  },
  plugins: [],
} 