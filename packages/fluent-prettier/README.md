# @berun/fluent-prettier

Use a chaining API to generate and simplify the modification of
prettier configurations.

\_Note: This is is part of the broader `@berun/fluent` suite of configurations, but may be used standalone.

### Example

```js
module.exports = function(berun, options) {
  berun.prettier
    .semi(false)
    .bracketSpacing(true)
    .rangeStart(0)
    .insertPragma(true)
    .requirePragma(false)
    .arrowParens('always')
    .end()
}

results in `--no-semi --range-start 0 --insert-pragma --allow-parens 'always'`
```
