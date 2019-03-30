import { Fluent } from './Fluent'

class $FluentSetAdmin<T> {
  name: string
  parent: any
  store: Set<T> = new Set()
}

export class FluentSet<PARENT, T> extends Fluent<PARENT> {
  $fluent: $FluentSetAdmin<T>

  constructor(parent: PARENT, name?: string) {
    super(parent, name)
    this.$fluent = new $FluentSetAdmin<T>()
  }

  add(value: T) {
    this.$fluent.store.add(value)
    return this
  }

  prepend(value: T) {
    this.$fluent.store = new Set<T>([value, ...this.$fluent.store])
    return this
  }

  clear() {
    this.$fluent.store.clear()
    return this
  }

  delete(value: T) {
    this.$fluent.store.delete(value)
    return this
  }

  values() {
    return [...this.$fluent.store]
  }

  has(value: T) {
    return this.$fluent.store.has(value)
  }

  merge(arr: T[]) {
    this.$fluent.store = new Set([...this.$fluent.store, ...arr])
    return this
  }

  toConfig() {
    return this.values()
  }

  when(
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
}
