/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // === Identidade Carretinha Mini Parke ===
        // Paleta leve "céu-de-dia" pensada para criança 0-7 anos:
        // azul-céu primário + amarelo-sol acento + verde-água/lima/lavanda secundárias.
        // brand: azul-céu (CTAs, links primários, foco)
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          DEFAULT: '#0ea5e9',
        },
        // accent: amarelo-sol (gradient-text, badges, brilhos festivos)
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          DEFAULT: '#facc15',
        },
        // support: teal/verde-água (info, "100% seguro", calma)
        support: {
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          DEFAULT: '#14b8a6',
        },
        // joy: verde-lima (energia, brinquedos verdes da carretinha)
        joy: {
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          DEFAULT: '#84cc16',
        },
        // magic: lavanda (depoimentos, FAQ, surpresa) — mais suave que violet
        magic: {
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          DEFAULT: '#a78bfa',
        },
        surface: {
          DEFAULT: '#f8fafc',
          card: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -15px rgba(15, 23, 42, 0.15)',
        nav: '0 8px 30px rgba(15, 23, 42, 0.08)',
        // Glow agora azul-céu (combina com a brand nova)
        glow: '0 20px 60px -20px rgba(14, 165, 233, 0.55)',
        'glow-accent': '0 20px 60px -20px rgba(250, 204, 21, 0.55)',
        'glow-support': '0 20px 60px -20px rgba(20, 184, 166, 0.55)',
      },
      backgroundImage: {
        // Gradiente assinatura: azul-céu → ciano → amarelo (céu de manhã com sol)
        'gradient-fun':
          'linear-gradient(135deg, #0ea5e9 0%, #2dd4bf 50%, #facc15 100%)',
        // Gradiente festa: 5 cores leves (sem rosa)
        'gradient-festa':
          'linear-gradient(135deg, #0ea5e9 0%, #a78bfa 25%, #14b8a6 50%, #84cc16 75%, #facc15 100%)',
        // Arco-íris suave para overlays
        'gradient-rainbow':
          'linear-gradient(90deg, #0ea5e9, #14b8a6, #84cc16, #facc15, #fb923c, #a78bfa)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out both',
        'fade-left': 'fadeLeft 0.6s ease-out both',
        'fade-right': 'fadeRight 0.6s ease-out both',
        'zoom-in': 'zoomIn 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        gradient: 'gradient 8s ease infinite',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'reveal-up': 'revealUp 0.7s ease-out both',
        'ball-rise': 'ballRise 12s linear infinite',
        wiggle: 'wiggle 1.5s ease-in-out infinite',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.04)' },
        },
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ballRise: {
          '0%': { transform: 'translateY(110vh) translateX(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.85' },
          '50%': { transform: 'translateY(50vh) translateX(20px) rotate(180deg)' },
          '90%': { opacity: '0.85' },
          '100%': { transform: 'translateY(-15vh) translateX(-20px) rotate(360deg)', opacity: '0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
};
