import type { Directive, DirectiveBinding } from 'vue'
import { nanoid } from 'nanoid'

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
