import { stringify as javascriptStringify } from 'javascript-stringify'

export abstract class Fluent<PARENT> {
  name: string

  parent: PARENT

  constructor(parent?: PARENT, name?: string) {
    this.parent = parent
    this.name = name
  }

  batch(handler: (_: this) => void) {
    handler(this)
    return this
  }

  public end(): PARENT {
    return this.parent
  }

  abstract merge(obj: any, omit: string[]): this

  abstract toConfig(): {}

  private static toString(config: {}, { verbose = false } = {}) {
    return javascriptStringify(
      config,
      (value, indent, stringify) => {
        // shorten long functions
        if (typeof value === 'function') {
          if (value.__expression) {
            return value.__expression
          }
          if (!verbose && value.toString().length > 100) {
            return `function () { /* omitted long function */ }`
          }
        }

        return stringify(value)
      },
      2
    )
  }

  toString(options: any) {
    return Fluent.toString(this.toConfig(), options)
  }
}
