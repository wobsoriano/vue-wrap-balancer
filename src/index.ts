/*!
 * Original code by Shu Ding
 * MIT Licensed, Copyright 2022 Shu Ding, see https://github.com/shuding/react-wrap-balancer/blob/main/LICENSE.md for details
 *
 * Credits:
 * https://github.com/shuding/react-wrap-balancer/blob/main/src/index.tsx
 */
import { type CSSProperties, computed, defineComponent, h, inject, onUnmounted, provide, ref, unref, watchEffect, withDirectives } from 'vue'
import { nanoid } from 'nanoid'
import { vBindOnce } from './utils'

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
  if (suffix)
    suffix = `self.${SYMBOL_NATIVE_KEY}!=1&&${suffix}`

  return h('script', {
    innerHTML: (injected ? '' : `self.${SYMBOL_NATIVE_KEY}=self.${SYMBOL_NATIVE_KEY}||${isTextWrapBalanceSupported};self.${SYMBOL_KEY}=${RELAYOUT_STR};`) + suffix,
    nonce,
  })
}

export const BalancerProvider = defineComponent({
  name: 'BalancerProvider',
  props: {
    /**
     * An option to skip the re-balance logic
     * and use the native CSS text-balancing if supported.
     * @default true
     */
    preferNative: {
      type: Boolean,
      required: false,
      default: true,
    },
    /**
     * The nonce attribute to allowlist inline script injection by the component
     */
    nonce: {
      type: String,
      required: false,
    },
  },
  setup(props, { slots }) {
    const preferNative = computed(() => props.preferNative)
    provide('BALANCER_PROVIDER', {
      preferNative,
      hasProvider: true,
    })

    return () => [
      createScriptElement(false, props.nonce),
      slots.default?.(),
    ]
  },
})

export const Balancer = defineComponent({
  name: 'Balancer',
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
     * An option to skip the re-balance logic
     * and use the native CSS text-balancing if supported.
     * @default true
     */
    preferNative: {
      type: Boolean,
      required: false,
      default: true,
    },
    /**
     * The nonce attribute to allowlist inline script injection by the component.
     */
    nonce: {
      type: String,
      required: false,
    },
  },
  setup(props, { slots, attrs }) {
    const As = props.as
    const id = attrs.id || nanoid(5)
    const wrapperRef = ref<HTMLElement | null>(null)
    const contextValue = inject('BALANCER_PROVIDER', {
      preferNative: true,
      hasProvider: false,
    })

    const preferNativeBalancing = computed(() => props.preferNative ?? unref(contextValue.preferNative))

    // Re-balance on content change and on mount/hydration
    watchEffect(() => {
      // Skip if the browser supports text-balancing natively.
      if (preferNativeBalancing.value && typeof self !== 'undefined' && self[SYMBOL_NATIVE_KEY] === 1)
        return

      if (wrapperRef.value)
        (self[SYMBOL_KEY] = relayout)(0, props.ratio, wrapperRef.value)
    })

    // Remove the observer when unmounting.
    onUnmounted(() => {
      // Skip if the browser supports text-balancing natively.
      if (preferNativeBalancing.value && typeof self !== 'undefined' && self[SYMBOL_NATIVE_KEY] === 1)
        return

      if (!wrapperRef.value)
        return

      const resizeObserver = wrapperRef.value[SYMBOL_OBSERVER_KEY]
      if (resizeObserver) {
        resizeObserver.disconnect()
        delete wrapperRef.value[SYMBOL_OBSERVER_KEY]
      }
    })

    return () => withDirectives(h(As, {
      ...attrs,
      'data-brr': props.ratio,
      'data-allow-mismatch': true,
      'ref': wrapperRef,
      'style': {
        ...attrs.style as CSSProperties,
        display: 'inline-block',
        verticalAlign: 'top',
        textDecoration: 'inherit',
        textWrap: preferNativeBalancing.value ? 'balance' : 'initial',
      },
    }, [
      slots.default?.(),
      withDirectives(createScriptElement(contextValue.hasProvider, props.nonce, `self.${SYMBOL_KEY}(document.currentScript.dataset.ssrId,${props.ratio})`), [
        [vBindOnce, ['data-ssr-id', id]],
      ]),
    ]), [
      [vBindOnce, ['data-br', id]],
    ])
  },
})

export default Balancer
