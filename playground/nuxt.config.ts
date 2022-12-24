// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: false,
  modules: ['nuxt-lazy-hydrate'],
  nitro: {
    preset: 'vercel',
  },
})
