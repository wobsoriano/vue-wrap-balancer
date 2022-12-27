import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  clean: true,
  minify: true,
  external: ['vue-demi'],
  dts: true,
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : `.${format}`,
    }
  },
})
