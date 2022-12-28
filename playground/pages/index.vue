<script setup lang="ts">
import Balancer from 'vue-wrap-balancer'
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
    <Comparison align="center">
      <template #a>
        <div class="item">
          <h2>
            Vue: A JavaScript framework for building UI on the web.
          </h2>
          <Content />
        </div>
      </template>
      <template #b>
        <div class="item">
          <h2>
            <Balancer>
              Vue: A JavaScript framework for building UI on the web.
            </Balancer>
          </h2>
          <Content />
        </div>
      </template>
    </Comparison>
    <h3>
      <Balancer>
        Vue Wrap Balancer avoids single hanging word on the last line
      </Balancer>
    </h3>
    <p class="headline">
      <Balancer>Custom Balance Ratio</Balancer>
    </p>
    <Ratio />
    <h3>
      <Balancer>
        Adjust the balance ratio to a custom value between
        <span class="code">0</span> (loose) and
        <span class="code">1</span> (compact, the default)
      </Balancer>
    </h3>
    <p class="headline">
      <Balancer>About Vue Wrap Balancer</Balancer>
    </p>
    <p style="text-align: left; font-size: 14px; display: flex; justify-content: center;">
      <Balancer>
        This <a href="https://github.com/wobsoriano/vue-wrap-balancer"> project</a> is a port of <a href="https://react-wrap-balancer.vercel.app/">react-wrap-balancer</a>
        which was inspired by Adobe’s <a href="https://github.com/adobe/balance-text">balance-text</a> project,
        and Daniel Aleksandersen’s <a href="https://www.ctrl.blog/entry/text-wrap-balance.html">Improving the New York Times’ line wrap balancer</a>.
        If you want to learn more, you can also take a look at the <a href="https://drafts.csswg.org/css-text-4/#text-wrap">text-wrap: balance</a> proposal.
      </Balancer>
    </p>
    <DeployedOnVercel />
  </main>
</template>
