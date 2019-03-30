import { FluentMap } from './FluentMap'

export class OrderableMap<PARENT> extends FluentMap<PARENT> {
  __after: string
  __before: string

  before(name: string) {
    if (this.__after) {
      throw new Error(
        `Unable to set .before(${JSON.stringify(
          name
        )}) with existing value for .after()`
      )
    }

    this.__before = name
    return this
  }

  after(name: string) {
    if (this.__before) {
      throw new Error(
        `Unable to set .after(${JSON.stringify(
          name
        )}) with existing value for .before()`
      )
    }

    this.__after = name
    return this
  }

  merge(obj: any, omit = []) {
    if (obj.before) {
      this.before(obj.before)
    }

    if (obj.after) {
      this.after(obj.after)
    }

    return super.merge(obj, [...omit, 'before', 'after'])
  }
}
