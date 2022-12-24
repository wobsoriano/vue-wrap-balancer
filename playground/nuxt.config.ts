// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: true,
  // modules: ['nuxt-lazy-hydrate'],
  nitro: {
    preset: 'vercel',
  },
})
