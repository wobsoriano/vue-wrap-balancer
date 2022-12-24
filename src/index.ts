import { computed, defineComponent, h, onMounted, onUnmounted, ref, watchPostEffect } from 'vue'
import { nanoid } from 'nanoid'

const SYMBOL_KEY = '__wrap_balancer'

const relayout = (
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
  const w = container.clientWidth
  const h = container.clientHeight

  // Synchronously do binary search and calculate the layout
  let l = w / 2
  let r = w
  let m

  if (w) {
    while (l + 1 < r) {
      m = ~~((l + r) / 2)
      update(m)
      if (container.clientHeight === h)
        r = m

      else
        l = m
    }

    // Update the wrapper width
    update(r * ratio + w * (1 - ratio))
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
  setup(props, { slots }) {
    const As = props.as
    const id = computed(() => props.id || nanoid(5))
    const wrapperRef = ref<HTMLElement | null>(null)

    // Re-balance on content change and on mount/hydration
    watchPostEffect(() => {
      if (!wrapperRef.value)
        return

      // @ts-expect-error: Re-assign function and Resize
      (self[SYMBOL_KEY] = relayout)(0, props.ratio, wrapperRef.value)
    })

    onMounted(() => {
      const container = wrapperRef.value?.parentElement as HTMLElement
      if (!container)
        return

      const resizeObserver = new ResizeObserver(() => {
        // @ts-expect-error: Resize
        self[SYMBOL_KEY](0, props.ratio, wrapperRef.value)
      })

      resizeObserver.observe(container)

      onUnmounted(() => {
        resizeObserver.unobserve(container)
      })
    })

    return () => [
      h(As, {
        'data-br': id.value,
        'data-brr': props.ratio,
        'ref': wrapperRef,
        'style': {
          display: 'inline-block',
          verticalAlign: 'top',
          textDecoration: 'inherit',
        },
      }, slots.default?.()),
      // Calculate the balance initially for SSR
      h('script', {
        innerHTML: `self.${SYMBOL_KEY}=${MINIFIED_RELAYOUT_STR};self.${SYMBOL_KEY}("${id.value}",${props.ratio})`,
      }),
    ]
  },
})
