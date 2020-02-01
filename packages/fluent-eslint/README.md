# @berun/fluent-eslint

Use a chaining API to generate and simplify the modification of
ESLint configurations.

\_Note: This is is part of the broader `@berun/fluent` suite of configurations,
but may be used standalone.

### Example

```js
export default function(berun: Berun, options) {
  berun.eslint
    .root(true)
    .parser('babel-eslint')
    .plugins.add('import')
    .add('flowtype')
    .add('jsx-a11y')
    .add('react')
    .end()
    .env({
      browser: true,
      commonjs: true,
      es6: true,
      jest: true,
      node: true
    })
    .parserOptions({
      ecmaVersion: 6,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
        generators: true,
        experimentalObjectRestSpread: true
      }
    })
    .rules.set('array-callback-return', 'warn')
    .set('default-case', ['warn', { commentPattern: /^no default$/ }])
    .end()
}
```
