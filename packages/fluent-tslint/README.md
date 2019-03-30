# @berun/fluent-tslint

Use a chaining API to generate and simplify the modification of
TSLint configurations.

\_Note: This is is part of the broader `@berun/fluent` suite of configurations, but may be used standalone.

### Example

```js
module.exports = function(berun, options) {
  berun.tslint.extends
    .add('tslint:recommended')
    .add('tslint-react')
    .end()
    .rules.merge({
      'arrow-parens': false,
      eofline: false,
      'interface-name': false,
      'jsx-boolean-value': false,
      'jsx-no-lambda': false,
      'jsx-no-multiline-js': false,
      'member-access': false,
      'no-return-await': false,
      'no-submodule-imports': false,
      'no-trailing-whitespace': false,
      'no-var-requires': false,
      'object-literal-sort-keys': false,
      'only-arrow-functions': false,
      'ordered-imports': false,
      'prefer-conditional-expression': false,
      semicolon: [true, 'always', 'ignore-bound-class-methods'],
      'trailing-comma': false,
      'variable-name': [
        true,
        'ban-keywords',
        'check-format',
        'allow-leading-underscore',
        'allow-pascal-case'
      ]
    })
    .end()
}
```
