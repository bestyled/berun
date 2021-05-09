# @bestatic/core

## Configuration

Add to your `@berun` config file. Requires (and must follow) `@berun/preset-react`

```js
// config/berun.config.ts

export default {
  use: [
    '@berun/preset-react',
    '@berun/preset-bestatic',
    '@berun/runner-eslint',
    '@berun/runner-prettier'
  ]
}
```
