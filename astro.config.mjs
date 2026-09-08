import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://luca-builds-ch.github.io',
  base: '/astro-workshop-demo',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
