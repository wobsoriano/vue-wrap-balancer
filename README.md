# Vue Wrap Balancer

Vue port of [React Wrap Balancer](https://github.com/shuding/react-wrap-balancer). Check here for a [demo](https://vue-wrap-balancer.vercel.app/) with Nuxt.

Vue Wrap Balancer is a simple Vue Component that makes your titles more readable in different viewport sizes. It improves the wrapping to avoid situations like single word in the last line, makes the content more “balanced”:

![](https://i.imgur.com/2LWVkXk.gif)

## Installation

```bash
npm install vue-wrap-balancer
```

## Usage

```vue
<script setup>
import Balancer from 'vue-wrap-balancer'
</script>

<template>
  <h1>
    <Balancer>My Awesome Title</Balancer>
  </h1>
</template>
```

It works with Vue 2 and 3.

## License

MIT
