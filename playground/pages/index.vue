<script setup lang="ts">
import { Balancer } from 'vue-wrap-balancer'
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
    <p style="position: relative;">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#363636"
        width="18"
        style="position: absolute; right: 100%; margin-top: 4; margin-right: 5;"
      >
        <path
          fill-rule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
          clip-rule="evenodd"
        />
      </svg>
      Note that if the native CSS balance (<a target="_blank" rel="noopener noreferrer" href="https://developer.chrome.com/blog/css-text-wrap-balance/">
        text-wrap: balance
      </a>) is available, Vue Wrap Balancer will use it instead. And the `ratio`
      option will be ignored in that case.
    </p>
    <p class="headline">
      <Balancer>How Does It Work?</Balancer>
    </p>
    <p>
      Vue Wrap Balancer reduces the width of the content wrapper as much as
      it could, before causing an extra line break. When the minimum width is
      reached, each line should approximately have the same width, hence it’ll
      look more balanced and compact.
    </p>
    <p>
      Check out the
      <a
        href="https://github.com/wobsoriano/vue-wrap-balancer"
        target="_blank"
      >
        GitHub Repository
      </a>
      to learn more.
    </p>
    <p class="headline">
      <Balancer>Use Cases</Balancer>
    </p>
    <Comparison static-width>
      <template #a="{ width }">
        <div class="tooltip-container">
          <div class="TooltipContent">
            <div :style="{ width }">
              <div class="tooltip item">
                This deployment is currently in progress. <a>Read more</a>.
              </div>
            </div>
            <svg
              class="TooltipArrow"
              width="10"
              height="5"
              viewBox="0 0 30 10"
              preserveAspectRatio="none"
            >
              <polygon points="0,0 30,0 15,10" />
            </svg>
          </div>
          <div class="tooltip-trigger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="16"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </template>
      <template #b="{ width }">
        <div class="tooltip-container">
          <div class="TooltipContent">
            <div :style="{ width }">
              <div class="tooltip item">
                <Balancer>
                  This deployment is currently in progress. <a>Read more</a>.
                </Balancer>
              </div>
            </div>
            <svg
              class="TooltipArrow"
              width="10"
              height="5"
              viewBox="0 0 30 10"
              preserveAspectRatio="none"
            >
              <polygon points="0,0 30,0 15,10" />
            </svg>
          </div>
          <div class="tooltip-trigger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="16"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </template>
    </Comparison>
    <h3>
      <Balancer>Useful in tooltips and other UI components</Balancer>
    </h3>
    <Comparison>
      <template #a>
        <h2 class="item">
          第六個沉思：論物質性東西的存在；論人的靈魂和肉體之間的實在區別
        </h2>
        <Content />
      </template>
      <template #b>
        <h2 class="item">
          <Balancer>
            第六個沉思：論物質性東西的存在；論人的靈魂和肉體之間的實在區別
          </Balancer>
        </h2>
        <Content />
      </template>
    </Comparison>
    <h3>
      <Balancer>Left aligned, non-latin content</Balancer>
    </h3>
    <Comparison>
      <template #a>
        <blockquote class="item">
          <span>
            You have wakened not out of sleep, but into a prior dream, and
            that dream lies within another, and so on, to infinity, which is
            the number of grains of sand. The path that you are to take is
            endless, and you will die before you have truly awakened.
          </span>
          <br>- Jorge Luis Borges
        </blockquote>
      </template>
      <template #b>
        <blockquote class="item">
          <Balancer>
            You have wakened not out of sleep, but into a prior dream, and
            that dream lies within another, and so on, to infinity, which is
            the number of grains of sand. The path that you are to take is
            endless, and you will die before you have truly awakened.
          </Balancer>
          <br>- Jorge Luis Borges
        </blockquote>
      </template>
    </Comparison>
    <h3>
      <Balancer>
        Makes multi-line content more compact with fewer visual changes when
        resizing
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
    <p style="text-align: center; font-size: 14px;">
      <Balancer>
        Special thanks to <a href="https://twitter.com/shuding_">Shu Ding</a>, the author of the React component.
      </Balancer>
    </p>
    <DeployedOnVercel />
  </main>
</template>
