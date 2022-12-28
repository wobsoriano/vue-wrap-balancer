<script setup lang="ts">
import { useSpring } from 'vue-use-spring'

defineProps({
  staticWidth: {
    type: Boolean,
    required: false,
    default: false,
  },
  align: {
    type: String,
    required: false,
    default: 'left',
  },
})

const api = useSpring({ w: 0.55 })

const slotWidth = computed(() => `calc(${api.w} * var(--w1) + ${150 * (1 - api.w) - 31 * api.w}px)`)

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
      class="demo" :style="{ width: staticWidth ? 'calc(55% + 144px)' : `calc(${api.w * 100}% + ${1 - api.w} * var(--w0))`, textAlign: align }"
    >
      <div>
        <legend>Default</legend>
        <slot name="a" :width="slotWidth" />
      </div>
      <div>
        <legend>With Balancer</legend>
        <slot name="b" :width="slotWidth" />
      </div>
    </div>
  </div>
</template>
