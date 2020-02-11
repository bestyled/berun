import * as deepmerge from 'deepmerge'
import { Fluent, FluentSet } from '.'
import { FluentValueInstance } from './FluentMapDecorators'

export class $FluentAdmin {
  store: Map<string, any> = new Map()

  shorthands: Array<string> = []

  childmaps: Array<string> = []

  childsets: Array<string> = []
}

export class FluentMap<PARENT> extends Fluent<PARENT> {
  protected $fluent: $FluentAdmin

  constructor(parent?: PARENT, name?: string) {
    super(parent, name)
    this.$fluent = this.$fluent || new $FluentAdmin()
  }

  // legacy API ;  prefer @fluent and extendfluent instead
  protected extend(methods: string[]) {
    this.$fluent.shorthands = this.$fluent.shorthands.concat(methods)
    methods.forEach(method => {
      this[method] = (value: any) => this.set(method, value)
    })
    return this
  }

  // call after setting @fluent or FluentValue on class properties
  protected extendfluent() {
    const fluentprops = [
      ...Object.getOwnPropertyNames(this).filter(
        value => !['$fluent', 'parent', 'name'].includes(value)
      ),
      // eslint-disable-next-line no-proto
      ...((this as any).__proto__.$fluentprops || [])
    ]

    if (fluentprops.length > 0) {
      const shorthands = fluentprops.filter(
        key => !(key in this) || this[key] === FluentValueInstance
      )

      const childmaps = fluentprops.filter(
        key => this[key] instanceof FluentMap
      )

      const childsets = fluentprops.filter(
        key => this[key] instanceof FluentSet
      )

      this.extend(shorthands)
      this.$fluent.childmaps = this.$fluent.childmaps.concat(childmaps)
      this.$fluent.childsets = this.$fluent.childsets.concat(childsets)
    }
  }

  public clear() {
    this.$fluent.store.clear()
    return this
  }

  public delete(key: string) {
    this.$fluent.store.delete(key)
    return this
  }

  public entries(omit: string[] = []) {
    const { entries, order } = this.order(omit)

    if (order.length) {
      return entries
    }

    return undefined
  }

  public values(omit: string[] = []) {
    const { entries, order } = this.order(omit)

    return order.map(name => entries[name])
  }

  public get(key: string): any {
    return this.$fluent.store.get(key)
  }

  public has(key: string): boolean {
    return this.$fluent.store.has(key)
  }

  public set(key: string, value: any) {
    this.$fluent.store.set(key, value)
    return this
  }

  protected clean(obj: any) {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key]

      if (value === undefined) {
        return acc
      }

      if (Array.isArray(value) && !value.length) {
        return acc
      }

      if (
        Object.prototype.toString.call(value) === '[object Object]' &&
        !Object.keys(value).length
      ) {
        return acc
      }

      acc[key] = value

      return acc
    }, {})
  }

  public toConfig(omit: string[] = []) {
    return this.clean({
      ...this.entries(),
      ...this.$fluent.childmaps.reduce((accum, key) => {
        if (!omit.includes(key)) {
          accum[key] = this[key].entries()
        }
        return accum
      }, {}),
      ...this.$fluent.childsets.reduce((accum, key) => {
        if (!omit.includes(key)) {
          accum[key] = this[key].values()
        }
        return accum
      }, {})
    })
  }

  public merge(obj: any, omit: string[] = []) {
    this.$fluent.childmaps.forEach(key => {
      if (!omit.includes(key) && key in obj) {
        this[key].merge(obj[key])
      }
    })

    this.$fluent.childsets.forEach(key => {
      if (!omit.includes(key) && key in obj) {
        this[key].merge(obj[key])
      }
    })

    const ommissions = omit
      .concat(this.$fluent.childsets)
      .concat(this.$fluent.childmaps)

    Object.keys(obj).forEach(key => {
      if (ommissions.includes(key)) {
        return
      }

      const value = obj[key]

      if (
        (!Array.isArray(value) && typeof value !== 'object') ||
        value === null ||
        !this.has(key)
      ) {
        this.set(key, value)
      } else {
        this.set(key, (deepmerge as any)(this.get(key), value))
      }
    })

    return this
  }

  public when(
    condition: boolean,
    whenTruthy = Function.prototype as (value: this) => void,
    whenFalsy = Function.prototype as (value: this) => void
  ) {
    if (condition) {
      whenTruthy(this)
    } else {
      whenFalsy(this)
    }

    return this
  }

  public order(omit: string[] = []) {
    const entries = [...this.$fluent.store].reduce((acc, [key, value]) => {
      if (!omit.includes(key)) {
        acc[key] = value
      }
      return acc
    }, {})
    const names = Object.keys(entries)
    const order = [...names]

    names.forEach(name => {
      if (!entries[name]) {
        return
      }

      const { __before, __after } = entries[name]

      if (__before && order.includes(__before)) {
        order.splice(order.indexOf(name), 1)
        order.splice(order.indexOf(__before), 0, name)
      } else if (__after && order.includes(__after)) {
        order.splice(order.indexOf(name), 1)
        order.splice(order.indexOf(__after) + 1, 0, name)
      }
    })

    return { entries, order }
  }
}
