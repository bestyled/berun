import { utils } from 'realm-utils'
import { isClass } from './Utils'

export class SparkyContextClass {
  // eslint-disable-next-line no-useless-constructor
  constructor(public target: any) {
    /** noop */
  }
}

let _SparkyCurrentContext: any

export function getSparkyContext() {
  if (!_SparkyCurrentContext) {
    _SparkyCurrentContext = {}
  }
  return _SparkyCurrentContext
}

export function SparkyContext(
  target: () =>
    | { [key: string]: any }
    | (new () => any)
    | { [key: string]: any }
) {
  if (utils.isPlainObject(target)) {
    _SparkyCurrentContext = target
  } else if (isClass(target)) {
    const Class: any = target
    _SparkyCurrentContext = new Class()
  } else if (utils.isFunction(target)) {
    _SparkyCurrentContext = target()
  }
  return new SparkyContextClass(_SparkyCurrentContext)
}
