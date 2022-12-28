import { h as hDemi, isVue2 } from 'vue-demi'
import type { Directive, DirectiveBinding } from 'vue-demi'
import { nanoid } from 'nanoid'

interface Options {
  props?: Record<string, string | number>
  domProps?: Record<string, any>
  on?: Record<string, Function>
}

const adaptOnsV3 = (ons: Object) => {
  if (!ons)
    return null
  return Object.entries(ons).reduce((ret, [key, handler]) => {
    key = key.charAt(0).toUpperCase() + key.slice(1)
    key = `on${key}`
    return { ...ret, [key]: handler }
  }, {})
}

export const h = (type: String | Record<any, any>, options: Options & any = {}, chidren?: any) => {
  if (isVue2)
    return hDemi(type, options, chidren)

  const { props, domProps, on, ...extraOptions } = options

  const ons = adaptOnsV3(on)
  const params = { ...extraOptions, ...props, ...domProps, ...ons }
  return hDemi(type, params, chidren)
}

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
