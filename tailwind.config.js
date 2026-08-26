/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        linen: {
          DEFAULT: '#FDF9F5',
          light: '#FFFDFB',
          surface: '#F7F3EF',
          muted: '#F1EDE9',
          deep: '#EBE4DC',
          dark: '#E2DBD2',
        },
        ink: {
          DEFAULT: '#2D2926',
          light: '#54433D',
          muted: '#7A6B65',
          sepia: '#3D271D',
          faint: '#A69B95',
        },
        terracotta: {
          light: '#E59880',
          DEFAULT: '#C06C4D',
          dark: '#91472B',
          deep: '#763318',
          faint: '#FDF0EC',
        },
        sage: {
          light: '#B5CCC1',
          DEFAULT: '#8DA399',
          dark: '#4E635A',
          deep: '#374B43',
          faint: '#EFF5F2',
        },
        blush: {
          light: '#FFF0EC',
          DEFAULT: '#E8B4A2',
          dark: '#C88572',
          faint: '#FAF1ED',
        },
        ochre: {
          light: '#F5DEB3',
          DEFAULT: '#D4A373',
          dark: '#B07D48',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'organic-sm': '6px',
        'organic': '10px',
        'organic-md': '14px',
        'organic-lg': '18px',
        'organic-xl': '24px',
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(45, 41, 38, 0.03)',
        'soft': '0 8px 30px rgba(45, 41, 38, 0.05)',
        'float': '0 20px 40px -15px rgba(45, 41, 38, 0.08)',
        'drawer': '-10px 0 30px rgba(45, 41, 38, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
