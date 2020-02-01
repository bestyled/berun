import { FluentSet as ChainedSet } from '../src'

test('is Chainable', () => {
  const parent = { parent: true }
  const set = new ChainedSet(parent)

  expect(set.end()).toBe(parent)
})

test('creates a backing Set', () => {
  const set = new ChainedSet()

  expect(set.$fluent.store instanceof Set).toBe(true)
})

test('add', () => {
  const set = new ChainedSet()

  expect(set.add('alpha')).toBe(set)
  expect(set.$fluent.store.has('alpha')).toBe(true)
  expect(set.$fluent.store.size).toBe(1)
})

test('prepend', () => {
  const set = new ChainedSet()

  set.add('alpha')

  expect(set.prepend('beta')).toBe(set)
  expect(set.$fluent.store.has('beta')).toBe(true)
  expect([...set.$fluent.store]).toEqual(['beta', 'alpha'])
})

test('clear', () => {
  const set = new ChainedSet()

  set.add('alpha')
  set.add('beta')
  set.add('gamma')

  expect(set.$fluent.store.size).toBe(3)
  expect(set.clear()).toBe(set)
  expect(set.$fluent.store.size).toBe(0)
})

test('delete', () => {
  const set = new ChainedSet()

  set.add('alpha')
  set.add('beta')
  set.add('gamma')

  expect(set.delete('beta')).toBe(set)
  expect(set.$fluent.store.size).toBe(2)
  expect(set.$fluent.store.has('beta')).toBe(false)
})

test('has', () => {
  const set = new ChainedSet()

  set.add('alpha')
  set.add('beta')
  set.add('gamma')

  expect(set.has('beta')).toBe(true)
  expect(set.has('delta')).toBe(false)
  expect(set.has('beta')).toBe(set.$fluent.store.has('beta'))
})

test('values', () => {
  const set = new ChainedSet()

  set.add('alpha')
  set.add('beta')
  set.add('gamma')

  expect(set.values()).toEqual(['alpha', 'beta', 'gamma'])
})

test('merge with no values', () => {
  const set = new ChainedSet()
  const arr = ['alpha', 'beta', 'gamma']

  expect(set.merge(arr)).toBe(set)
  expect(set.values()).toEqual(arr)
})

test('merge with existing values', () => {
  const set = new ChainedSet()
  const arr = ['alpha', 'beta', 'gamma']

  set.add('delta')

  expect(set.merge(arr)).toBe(set)
  expect(set.values()).toEqual(['delta', 'alpha', 'beta', 'gamma'])
})

test('when true', () => {
  const set = new ChainedSet()
  const right = instance => {
    expect(instance).toBe(set)
    instance.add('alpha')
  }
  const left = instance => {
    instance.add('beta')
  }

  expect(set.when(true, right, left)).toBe(set)
  expect(set.has('alpha')).toBe(true)
  expect(set.has('beta')).toBe(false)
})

test('when false', () => {
  const set = new ChainedSet()
  const right = instance => {
    instance.add('alpha')
  }
  const left = instance => {
    expect(instance).toBe(set)
    instance.add('beta')
  }

  expect(set.when(false, right, left)).toBe(set)
  expect(set.has('alpha')).toBe(false)
  expect(set.has('beta')).toBe(true)
})
