import { FluentMap, FluentSet, FluentValue } from '@berun/fluent'
import { Transform } from './Transform'

export class Jest<PARENT> extends FluentMap<PARENT> {
  collectCoverageFrom = new FluentSet(this)
  setupFiles = new FluentSet(this)
  testMatch = new FluentSet(this)
  roots = new FluentSet(this)
  transformIgnorePatterns = new FluentSet(this)
  moduleFileExtensions = new FluentSet(this)
  moduleNameMapper = new FluentMap(this)
  transforms = new FluentMap(this)
  testEnvironment = FluentValue<this, any>()
  testURL = FluentValue<this, string>()
  rootDir = FluentValue<this, string>()

  constructor(parent?: PARENT, name?: string) {
    super(parent, name)
    this.extendfluent()
  }

  transform(name: string): Transform<this> {
    if (!this.transforms.has(name)) {
      this.transforms.set(name, new Transform(this, name))
    }

    return this.transforms.get(name)
  }

  toConfig(omit: string[] = []) {
    return Object.assign(
      super.toConfig(omit.concat('transforms')),
      this.clean({
        transform: this.transforms
          .values()
          .map(t => t.toConfig())
          .reduce((acc, t) => {
            acc[t.test.toString().replace(/^\/|\/$/g, '')] = t.plugin
            return acc
          }, {})
      })
    )
  }

  merge(obj, omit = []) {
    if (!omit.includes('transform') && 'transform' in obj) {
      Object.keys(obj.transform).forEach(name =>
        this.transform(name).merge(obj.transform[name])
      )
    }

    return super.merge(obj, [...omit, 'transform', 'transforms'])
  }
}
