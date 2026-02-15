export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        latex: {
          blue: '#003366',
          dark: '#002244',
          light: '#004488',
        },
        academic: {
          gray: '#4a5568',
          light: '#f7fafc',
        },
      },
      fontFamily: {
        serif: ['"Latin Modern Roman"', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
};
