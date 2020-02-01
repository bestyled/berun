# @bestatic/core

## Configuration

Add to your `@berun` config file. Requires (and must follow) `@berun/runner-react` or `@berun-runner-fuse-box-react`

```js
// config/berun.config.ts

export default {
  use: [
    '@berun/preset-fuse-box-react',
    '@berun/preset-bestatic',
    '@berun/runner-eslint',
    '@berun/runner-prettier'
  ]
}
```
