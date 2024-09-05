<script setup lang="ts">
import { Balancer } from 'vue-wrap-balancer'
import { useSpring } from 'vue-use-spring'

const ratio = useSpring({ w: 0.65 })

function handleRangeChange(payload: Event) {
  ratio.w = Number((payload.target as any).value) / 100
}
</script>

<template>
  <div class="demo-container">
    <div class="controller">
      <input
        type="range"
        defaultValue="65"
        @input="handleRangeChange"
      >
    </div>
    <div class="demo" style="width: 480px; max-width: 100%">
      <div style="text-align: center; position: relative;">
        <div>
          <h2 class="ratio-ruler">
            <Balancer>
              <span>The quick brown fox jumps over the lazy dog</span>
            </Balancer>
          </h2>
          <h2 class="ratio-title">
            <Balancer :ratio="ratio.w" :prefer-native="false">
              The quick brown fox jumps over the lazy dog
            </Balancer>
          </h2>
          <code>{{ `<Balancer ratio="${ratio.w.toFixed(2)}" />` }}</code>
        </div>
      </div>
    </div>
  </div>
</template>
