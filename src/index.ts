/*!
 * Original code by Shu Ding
 * MIT Licensed, Copyright 2022 Shu Ding, see https://github.com/shuding/react-wrap-balancer/issues/6 for details
 *
 * Credits to the team:
 * https://github.com/shuding/react-wrap-balancer/blob/main/src/index.tsx
 */
import type { DirectiveBinding } from 'vue-demi'
import { type Directive, defineComponent, onMounted, onUnmounted, ref, watchPostEffect, withDirectives } from 'vue-demi'
import { nanoid } from 'nanoid'
import { h } from './utils'

const SYMBOL_KEY = '__wrap_balancer'

export const vBindOnce: Directive<HTMLElement> = {
  created(el, binding: DirectiveBinding<[string, string]>) {
    const [key, value] = binding.value
    el.setAttribute(key, value || nanoid(5))
  },
  getSSRProps(binding: DirectiveBinding<[string, string]>) {
    const [key, value] = binding.value
    return {
      [key]: value,
    }
  },
}

type RelayoutFn = (
  id: string | number,
  ratio: number,
  wrapper?: HTMLElement
) => void

declare global {
  interface Window {
    [SYMBOL_KEY]: RelayoutFn
  }
}

const relayout: RelayoutFn = (
  id: string | number,
  ratio: number,
  wrapper?: HTMLElement,
) => {
  wrapper
    = wrapper || (document.querySelector(`[data-br="${id}"]`) as HTMLElement)

  const container = wrapper.parentElement as HTMLElement

  const update = (width: number) => (wrapper!.style.maxWidth = `${width}px`)

  // Reset wrapper width
  wrapper.style.maxWidth = ''

  // Get the intial container size
  const width = container.clientWidth
  const height = container.clientHeight

  // Synchronously do binary search and calculate the layout
  let left: number = width / 2
  let right: number = width
  let middle: number

  if (width) {
    while (left + 1 < right) {
      middle = ~~((left + right) / 2)
      update(middle)
      if (container.clientHeight === height)
        right = middle

      else
        left = middle
    }

    // Update the wrapper width
    update(right * ratio + width * (1 - ratio))
  }
}

const MINIFIED_RELAYOUT_STR = relayout.toString()

export default defineComponent({
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
     * Custom id for SSR.
     */
    id: {
      type: [String, Number],
      required: false,
    },
  },
  setup(props, { slots, attrs }) {
    const As = props.as
    const id = props.id || nanoid(5)
    const wrapperRef = ref<HTMLElement | null>(null)

    // Re-balance on content change and on mount/hydration
    watchPostEffect(() => {
      if (!wrapperRef.value)
        return

      (self[SYMBOL_KEY] = relayout)(0, props.ratio, wrapperRef.value)
    })

    // Re-balance on resize
    onMounted(() => {
      if (!wrapperRef.value)
        return

      const container = wrapperRef.value.parentElement
      if (!container)
        return

      const resizeObserver = new ResizeObserver(() => {
        if (!wrapperRef.value)
          return
        self[SYMBOL_KEY](0, props.ratio, wrapperRef.value)
      })

      resizeObserver.observe(container)

      onUnmounted(() => {
        resizeObserver.unobserve(container)
      })
    })

    return () => [
      withDirectives(h(As, {
        ...attrs,
        'data-brr': props.ratio,
        'ref': wrapperRef,
        'style': {
          display: 'inline-block',
          verticalAlign: 'top',
          textDecoration: 'inherit',
        },
      }, slots.default?.()), [
        [vBindOnce, ['data-br', id]],
      ]),
      // Calculate the balance initially for SSR.
      withDirectives(h('script', {
        innerHTML: `self.${SYMBOL_KEY}=${MINIFIED_RELAYOUT_STR};self.${SYMBOL_KEY}(document.currentScript.dataset.ssrId,${props.ratio})`,
      }), [
        [vBindOnce, ['data-ssr-id', id]],
      ]),
    ]
  },
})
