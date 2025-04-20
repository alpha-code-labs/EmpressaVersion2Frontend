/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          luxury: {
            primary: '#1A1A1A',     // Rich black
            secondary: '#D4AF37',   // Metallic gold
            accent: '#8A7968',      // Taupe/Bronze
            light: '#F5F5F5',       // Soft white
            dark: '#0A0A0A',        // Deep black
            muted: '#6D6D6D',       // Sophisticated gray
          },
        },
        fontFamily: {
          'sans': ['Montserrat', 'sans-serif'],
          'serif': ['Playfair Display', 'serif'],
        },
        boxShadow: {
          'luxury': '0 4px 30px rgba(0, 0, 0, 0.1)',
          'luxury-hover': '0 10px 50px rgba(0, 0, 0, 0.2)',
        }
      },
    },
    plugins: [],
  }