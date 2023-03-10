/*!
 * Original code by Shu Ding
 * MIT Licensed, Copyright 2022 Shu Ding, see https://github.com/shuding/react-wrap-balancer/blob/main/LICENSE.md for details
 *
 * Credits to the team:
 * https://github.com/shuding/react-wrap-balancer/blob/main/src/index.tsx
 */
import { defineComponent, h, inject, onUnmounted, provide, ref, watchPostEffect, withDirectives } from 'vue'
import { nanoid } from 'nanoid'
import { vBindOnce } from './utils'

const SYMBOL_KEY = '__wrap_b'
const SYMBOL_OBSERVER_KEY = '__wrap_o'

type RelayoutFn = (
  id: string | number,
  ratio: number,
  wrapper?: HTMLElement
) => void

declare global {
  interface Window {
    [SYMBOL_KEY]: RelayoutFn
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

function createScriptElement(injected: boolean, suffix?: string) {
  return h('script', {
    innerHTML: (injected ? '' : `self.${SYMBOL_KEY}=${RELAYOUT_STR};`) + (suffix || ''),
  })
}

export const Provider = defineComponent({
  name: 'BalancerProvider',
  setup(_props, { slots }) {
    provide('BALANCER_CONTEXT', true)

    return () => [
      createScriptElement(false),
      slots.default?.(),
    ]
  },
})

export default defineComponent({
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
  },
  setup(props, { slots, attrs }) {
    const As = props.as
    const id = attrs.id || nanoid(5)
    const wrapperRef = ref<HTMLElement | null>(null)
    const hasProvider = inject<boolean>('BALANCER_CONTEXT', false)

    // Re-balance on content change and on mount/hydration
    watchPostEffect(() => {
      if (!wrapperRef.value)
        return

      ;(self[SYMBOL_KEY] = relayout)(0, props.ratio, wrapperRef.value)
    })

    // Remove the observer when unmounting.
    onUnmounted(() => {
      if (!wrapperRef.value)
        return

      const resizeObserver = wrapperRef.value[SYMBOL_OBSERVER_KEY]
      if (resizeObserver) {
        resizeObserver.disconnect()
        delete wrapperRef.value[SYMBOL_OBSERVER_KEY]
      }
    })

    return () => [
      withDirectives(h(As, {
        ...attrs,
        'data-brr': props.ratio,
        'ref': wrapperRef,
        'style': {
          ...attrs.style as Record<string, string>,
          display: 'inline-block',
          verticalAlign: 'top',
          textDecoration: 'inherit',
        },
      }, slots.default?.()), [
        [vBindOnce, ['data-br', id]],
      ]),
      withDirectives(createScriptElement(hasProvider, `self.${SYMBOL_KEY}(document.currentScript.dataset.ssrId,${props.ratio})`), [
        [vBindOnce, ['data-ssr-id', id]],
      ]),
    ]
  },
})
