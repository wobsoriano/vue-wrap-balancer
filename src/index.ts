/* eslint-disable vue/one-component-per-file */
/*!
 * Original code by Shu Ding
 * MIT Licensed, Copyright 2022 Shu Ding, see https://github.com/shuding/react-wrap-balancer/blob/main/LICENSE.md for details
 *
 * Credits to the team:
 * https://github.com/shuding/react-wrap-balancer/blob/main/src/index.tsx
 */
import { defineComponent, h, inject, onUnmounted, provide, ref, watchPostEffect } from 'vue'
import { Fragment } from 'vue-fragment'
import { nanoid } from 'nanoid'

const SYMBOL_KEY = '__wrap_b'
const SYMBOL_NATIVE_KEY = '__wrap_n'
const SYMBOL_OBSERVER_KEY = '__wrap_o'

type RelayoutFn = (
  id: string | number,
  ratio: number,
  wrapper?: HTMLElement
) => void

declare global {
  interface Window {
    [SYMBOL_KEY]: RelayoutFn
    // A flag to indicate whether the browser supports text-balancing natively.
    // undefined: not injected
    // 1: injected and supported
    // 2: injected but not supported
    [SYMBOL_NATIVE_KEY]?: number
  }

  interface HTMLElement {
    [SYMBOL_OBSERVER_KEY]: ResizeObserver | undefined
  }
}

const relayout: RelayoutFn = (id, ratio, wrapper) => {
  wrapper = wrapper || (document.querySelector(`[data-br="${id}"]`) as HTMLElement)
  const container = wrapper.parentElement as HTMLElement

  const update = (width: number) => (wrapper!.style.maxWidth = `${width}px`)

  // Reset wrapper width
  wrapper.style.maxWidth = ''

  // Get the intial container size
  const width = container.clientWidth
  const height = container.clientHeight

  // Synchronously do binary search and calculate the layout
  let lower: number = width / 2 - 0.25
  let upper: number = width + 0.5
  let middle: number

  if (width) {
    // Ensure we don't search widths lower than when the text overflows
    update(lower)
    lower = Math.max(wrapper.scrollWidth, lower)

    while (lower + 1 < upper) {
      middle = Math.round((lower + upper) / 2)
      update(middle)
      if (container.clientHeight === height)
        upper = middle

      else
        lower = middle
    }

    // Update the wrapper width
    update(upper * ratio + width * (1 - ratio))
  }

  // Create a new observer if we don't have one.
  // Note that we must inline the key here as we use `toString()` to serialize
  // the function.
  if (!wrapper.__wrap_o) {
    (wrapper.__wrap_o = new ResizeObserver(() => {
      self.__wrap_b(0, +wrapper!.dataset.brr!, wrapper)
    })).observe(container)
  }
}

const RELAYOUT_STR = relayout.toString()

const isTextWrapBalanceSupported = '(self.CSS&&CSS.supports("text-wrap","balance")?1:2)'

function createScriptElement(injected: boolean, nonce?: string, suffix?: string) {
  return h('script', {
    domProps: {
      innerHTML: (injected ? '' : `self.${SYMBOL_NATIVE_KEY}=self.${SYMBOL_NATIVE_KEY}||${isTextWrapBalanceSupported};self.${SYMBOL_KEY}=${RELAYOUT_STR};`) + suffix,
      nonce,
    },
  })
}

export const Provider = defineComponent({
  name: 'BalancerProvider',
  components: { Fragment },
  props: {
    /**
     * The nonce attribute to allowlist inline script injection by the component
     */
    nonce: {
      type: String,
      required: false,
    },
  },
  setup(props, { slots }) {
    provide('BALANCER_CONTEXT', true)

    return () => h('Fragment', [
      createScriptElement(false, props.nonce),
      slots.default?.(),
    ])
  },
})

export default defineComponent({
  name: 'WrapBalancer',
  components: { Fragment },
  props: {
    /**
     * The HTML tag to use for the wrapper element.
     * @default 'span'
     */
    as: {
      type: String,
      required: false,
      default: 'span',
    },
    /**
     * The balance ratio of the wrapper width (0 <= ratio <= 1).
     * 0 means the wrapper width is the same as the container width (no balance, browser default).
     * 1 means the wrapper width is the minimum (full balance, most compact).
     * @default 1
     */
    ratio: {
      type: Number,
      required: false,
      default: 1,
    },
    /**
     * The nonce attribute to allowlist inline script injection by the component.
     */
    nonce: {
      type: String,
      required: false,
    },
    /**
     * Required for SSR.
     */
    id: {
      type: String,
      required: false,
      default: nanoid(5),
    },
  },
  setup(props, { slots, attrs }) {
    const As = props.as
    const id = props.id
    const wrapperRef = ref<HTMLElement | null>(null)
    const hasProvider = inject<boolean>('BALANCER_CONTEXT', false)

    // Re-balance on content change and on mount/hydration
    watchPostEffect(() => {
      // Skip if the browser supports text-balancing natively.
      if (typeof self !== 'undefined' && self[SYMBOL_NATIVE_KEY] === 1)
        return

      if (wrapperRef.value)
        (self[SYMBOL_KEY] = relayout)(0, props.ratio, wrapperRef.value)
    })

    // Remove the observer when unmounting.
    onUnmounted(() => {
      // Skip if the browser supports text-balancing natively.
      if (typeof self !== 'undefined' && self[SYMBOL_NATIVE_KEY] === 1)
        return

      if (!wrapperRef.value)
        return

      const resizeObserver = wrapperRef.value[SYMBOL_OBSERVER_KEY]
      if (resizeObserver) {
        resizeObserver.disconnect()
        delete wrapperRef.value[SYMBOL_OBSERVER_KEY]
      }
    })

    return () => h('Fragment', [
      h(As, {
        ...attrs,
        domProps: {
          'data-brr': props.ratio,
          'data-br': id,
        },
        ref: wrapperRef,
        style: {
          ...attrs?.style as Record<string, string>,
          display: 'inline-block',
          verticalAlign: 'top',
          textDecoration: 'inherit',
          // @ts-expect-error: text-wrap not available
          textWrap: 'balance',
        },
      }, slots.default?.()),
      createScriptElement(hasProvider, `self.${SYMBOL_KEY}('${id}',${props.ratio})`),
    ])
  },
})
