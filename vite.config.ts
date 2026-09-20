import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

/** BUNDLE=1 emits one JS and one CSS file so `deno task bundle` can inline
 *  everything into a single self-contained page. */
const single = Deno.env.get('BUNDLE') === '1'

export default defineConfig({
  plugins: [svelte()],
  server: { port: 5180, strictPort: true },
  build: {
    target: 'es2022',
    cssCodeSplit: !single,
    rollupOptions: {
      output: single
        ? { inlineDynamicImports: true }
        : {
            // three is only needed by the hero field, which loads after paint.
            manualChunks: (id: string) => (id.includes('/three/') ? 'three' : undefined),
          },
    },
  },
})
