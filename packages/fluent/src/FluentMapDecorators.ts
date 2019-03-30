export const FluentValueInstance = {}

// tslint:disable-next-line:function-name
export function FluentValue<T, V>(obj?: T, value?: V): (value: V) => T {
  /* placeholder function that gets replaced by FluentMap's this.extendfluent() */
  return FluentValueInstance as any
}

export function fluent<T>(target: T, key: string): any {
  const descriptor = arguments[2]
  ;(target as any).$fluentprops = (target as any).$fluentprops || []
  ;(target as any).$fluentprops.push(key)

  descriptor.configurable = true
  descriptor.writable = true
  descriptor.value = FluentValueInstance

  if (!descriptor.initializer) {
    delete descriptor.initializer
  }

  return descriptor
}
