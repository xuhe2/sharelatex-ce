import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  base: '/sharelatex-ce/',
  site: 'https://xuhe2.github.io/sharelatex-ce/',
  build: {
    format: 'directory',
    assets: 'assets',
  },
});
