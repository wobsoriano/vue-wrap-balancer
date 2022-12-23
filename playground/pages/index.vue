<script setup lang="ts">
import Balancer from 'vue-wrap-balancer'
import { useSpring } from 'vue-use-spring'

const ratio = useSpring({ w: 0.65 })

function handleRangeChange(payload: Event) {
  ratio.w = Number((payload.target as any).value) / 100
}
</script>

<template>
  <main>
    <div class="logo-container">
      <a
        href="https://github.com/wobsoriano/vue-wrap-balancer"
        target="_blank"
        class="logo"
      >
        Vue
        <br>
        Wrap
        <br>
        Balancer
      </a>
    </div>
    <p class="headline">
      <Balancer>
        Simple Vue Component That Makes Titles More Readable
      </Balancer>
    </p>
    <div>
      <Head>
        <Link href="https://fonts.googleapis.com/css2?family=Inter&family=Alice:wght@400;700&display=block&subset=latin" rel="stylesheet" />
      </Head>
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
                <Balancer :ratio="ratio.w">
                  The quick brown fox jumps over the lazy dog
                </Balancer>
              </h2>
              <code>{{ `<Balancer ratio="${ratio.w.toFixed(2)}" />` }}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h3>
      <Balancer>
        Adjust the balance ratio to a custom value between
        <span class="code">0</span> (loose) and
        <span class="code">1</span> (compact, the default)
      </Balancer>
    </h3>
  </main>
</template>
