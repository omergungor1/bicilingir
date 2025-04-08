/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
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
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: 'fadeIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 