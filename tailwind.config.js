/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
          DEFAULT: 'var(--brand-700)',
        },
        surface: {
          base: 'var(--surface-base)',
          card: 'var(--surface-card)',
          subtle: 'var(--surface-subtle)',
          muted: 'var(--surface-muted)',
          hover: 'var(--surface-hover)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border-default)',
          strong: 'var(--border-strong)',
          brand: 'var(--border-brand)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
          brand: 'var(--text-brand)',
        },
        accent: {
          purple: 'var(--accent-purple)',
          'purple-subtle': 'var(--accent-purple-subtle)',
          emerald: 'var(--accent-emerald)',
          'emerald-subtle': 'var(--accent-emerald-subtle)',
          amber: 'var(--accent-amber)',
          'amber-subtle': 'var(--accent-amber-subtle)',
          rose: 'var(--accent-rose)',
          'rose-subtle': 'var(--accent-rose-subtle)',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        glow: 'var(--shadow-glow)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
    },
  },
  plugins: [],
};
