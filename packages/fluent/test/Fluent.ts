import { Fluent } from '../src'

class FluentTest extends Fluent<any> {
  merge(obj: any, omit: string[]) {
    return this
  }

  toConfig(omit?: string[]) {
    return {}
  }
}

test('Using .batch() receives context', () => {
  const chain = new FluentTest()
  const context = chain.batch(current => {
    expect(current).toBe(chain)
  })

  expect(context).toBe(chain)
})
