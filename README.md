# Vue Wrap Balancer

Vue port of [React Wrap Balancer](https://github.com/shuding/react-wrap-balancer). Check here for a [demo](https://vue-wrap-balancer.vercel.app/) with Nuxt.

Vue Wrap Balancer is a simple Vue Component that makes your titles more readable in different viewport sizes. It improves the wrapping to avoid situations like single word in the last line, makes the content more “balanced”:

![](https://i.imgur.com/2LWVkXk.gif)

## Installation

```bash
npm install vue-wrap-balancer
```

## Usage

Wrap text content with it:

```vue
<script setup>
import { Balancer } from 'vue-wrap-balancer'
</script>

<template>
  <h1>
    <Balancer>My Awesome Title</Balancer>
  </h1>
</template>
```

### `<Balancer>`

`<Balancer>` is the main component of the library. It will automatically balance the text content inside it. It accepts the following props:

- **`as`** (_optional_): The HTML tag to be used to wrap the text content. Default to `span`.
- **`ratio`** (_optional_): The ratio of “balance-ness”, 0 <= ratio <= 1. Default to `1`.
- **`preferNative`** (_optional_): An option to skip the re-balance logic and use the native CSS text-balancing if supported. Default to `true`.
- **`nonce`** (_optional_): The [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) attribute to allowlist inline script injection by the component.

### `<BalancerProvider>`

If you have multiple `<WrapBalancer>` components used, it’s recommended (but optional) to use `<BalancerProvider>` to wrap the entire app. This will make them share the re-balance logic and reduce the HTML size:

```vue
<script setup>
import { BalancerProvider } from 'vue-wrap-balancer'
</script>

<template>
  <BalancerProvider>
    <App />
  </BalancerProvider>
</template>
```

For use cases, please visit [**vue-wrap-balancer.vercel.app**](https://vue-wrap-balancer.vercel.app).

For Vue 2, check [this](https://github.com/wobsoriano/vue-wrap-balancer/tree/vue2) branch.

## Browser Support Information
Desktop:

| Browser | Min Version |
|:-------:|:-----------:|
| Chrome  |     64      |
|  Edge   |     79      |
| Safari  |    13.1     |
| FireFox |     69      |
|  Opera  |     51      |
|   IE    | No Support  |

Mobile:

|     Browser     | Min Version |
|:---------------:|:-----------:|
|     Chrome      |     64      |
|     Safari      |    13.4     |
|     Firefox     |     69      |
|      Opera      |     47      |
| WebView Android |     64      |

## License

MIT
