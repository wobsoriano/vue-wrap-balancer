export default defineNuxtConfig({
  app: {
    head: {
      title: 'Vue Wrap Balancer',
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Alice&family=Inter:wght@400;700&display=block&subset=latin' },
      ],
      meta: [
        { name: 'description', content: 'Simple Vue Component That Makes Titles More Readable' },
        { name: 'keywords', content: 'vue, wrapping, typography, balance, web' },
        { name: 'author', content: 'Robert Soriano' },
        { name: 'og:title', content: 'Vue Wrap Balancer' },
        { name: 'og:description', content: 'Simple Vue Component That Makes Titles More Readable' },
        { name: 'og:site_name', content: 'Vue Wrap Balancer' },
        { name: 'og:url', content: 'https://vue-wrap-balancer.vercel.app' },
        { name: 'og:image', content: 'https://og-image.vercel.app/Vue%20Wrap%20Balancer.png' },
      ],
    },
  },

  nitro: {
    preset: 'vercel',
  },

  compatibilityDate: '2024-09-05',
})
