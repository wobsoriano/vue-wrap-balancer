import { defineConfig } from 'tsup'

export default defineConfig((opts) => {
  return {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    clean: true,
    minify: opts.env?.NODE_ENV === 'production',
    sourcemap: true,
    dts: true,
  }
})
