# Vue Wrap Balancer

Vue port of [React Wrap Balancer](https://github.com/shuding/react-wrap-balancer). Check here for a [demo](https://vue-wrap-balancer.vercel.app/) with Nuxt.

Vue Wrap Balancer is a simple Vue Component that makes your titles more readable in different viewport sizes. It improves the wrapping to avoid situations like single word in the last line, makes the content more “balanced”:

![](https://i.imgur.com/2LWVkXk.gif)

## Installation

```bash
npm install vue-wrap-balancer
```

## Usage

The simplest way is to wrap the text content with `<Balancer>`:

```vue
<script setup>
import Balancer from 'vue-wrap-balancer'
</script>

<template>
  <h1>
    <Balancer>My Title</Balancer>
  </h1>
</template>
```

If you have multiple `<Balancer>` components used, it’s recommended (but optional) to use `<Provider>` to wrap the entire app. This will make them share the re-balance logic and reduce the HTML size:

```vue
<script setup>
import { Provider } from 'vue-wrap-balancer'
</script>

<template>
  <Provider>
    <App />
  </Provider>
</template>
```

For use cases, please visit [**vue-wrap-balancer.vercel.app**](https://vue-wrap-balancer.vercel.app).

For Vue 2, check [this](https://github.com/wobsoriano/vue-wrap-balancer/tree/vue2) branch.

## License

MIT
