import { FluentMap } from '@berun/fluent'

export class Transform<PARENT> extends FluentMap<PARENT> {
  test(test: RegExp | string) {
    return this.set('test', test instanceof RegExp ? test : new RegExp(test))
  }

  use(plugin = '') {
    return this.set('plugin', plugin)
  }

  merge(obj, omit = []) {
    if (!omit.includes('test') && 'test' in obj) {
      this.test(obj.test)
    }

    if (!omit.includes('plugin') && 'plugin' in obj) {
      this.use(obj.plugin)
    }

    return super.merge(obj, [...omit, 'test', 'plugin'])
  }
}
