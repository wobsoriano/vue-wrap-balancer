<script setup lang="ts">
import { useSpring } from 'vue-use-spring'

defineProps({
  align: {
    type: String,
    required: false,
    default: 'left',
  },
})

const api = useSpring({ w: 0.55 })

function handleRangeChange(payload: Event) {
  api.w = Number((payload.target as any).value) / 100
}
</script>

<template>
  <div class="demo-container">
    <div class="controller">
      <input
        type="range"
        defaultValue="55"
        @input="handleRangeChange"
      >
    </div>
    <div
      class="demo" :style="{ width: `calc(${api.w * 100}% + ${1 - api.w} * var(--w0))`, textAlign: align }"
    >
      <div>
        <legend>Default</legend>
        <slot name="a" />
      </div>
      <div>
        <legend>With Balancer</legend>
        <slot name="b" />
      </div>
    </div>
  </div>
</template>
