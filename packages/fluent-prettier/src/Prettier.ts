import { FluentMap, FluentSet, FluentValue } from '@berun/fluent'

export class Prettier<PARENT> extends FluentMap<PARENT> {
  printWidth = FluentValue<this, number>()

  tabWidth = FluentValue<this, number>()

  useTabs = FluentValue<this, boolean>()

  semi = FluentValue<this, boolean>()

  singleQuote = FluentValue<this, boolean>()

  trailingComma = FluentValue<this, string>()

  bracketSpacing = FluentValue<this, boolean>()

  jsxBracketSameLine = FluentValue<this, boolean>()

  arrowParens = FluentValue<this, string>()

  rangeStart = FluentValue<this, number>()

  rangeEnd = FluentValue<this, number>()

  parser = FluentValue<this, string>()

  filepath = FluentValue<this, string>()

  requirePragma = FluentValue<this, boolean>()

  insertPragma = FluentValue<this, boolean>()

  proseWrap = FluentValue<this, string>()

  overrides = new FluentSet(this)

  // CLI only

  noConfig = FluentValue<this, boolean>()

  debugCheck = FluentValue<this, boolean>()

  config = FluentValue<this, string>()

  ignorePath = FluentValue<this, string>()

  listDifferent = FluentValue<this, boolean>()

  configPrecedence = FluentValue<this, string>()

  noEditorConfig = FluentValue<this, boolean>()

  withNodeModules = FluentValue<this, boolean>()

  write = FluentValue<this, boolean>()

  logLevel = FluentValue<this, string>()

  stdinFilepath = FluentValue<this, string>()

  files = new FluentSet(this)

  constructor(parent?: PARENT, name?: string) {
    super(parent)
    this.extendfluent()
  }

  public toArgs(omit: string[] = []) {
    const config = this.toConfig(omit)

    const dashified: any = Object.keys(config || {}).reduce((output, key) => {
      if (['semi', 'bracketSpacing'].indexOf(key) !== -1) {
        output[`no-${dashify(key)}`] = !config[key]
      } else {
        output[dashify(key)] = config[key]
      }

      return output
    }, {})

    return Object.keys(dashified)
      .reduce((output, key) => {
        if (key === 'files') {
          /* no op, move to end */
        } else if (
          [
            'use-tabs',
            'no-semi',
            'single-quote',
            'no-bracket-spacing',
            'jsx-bracket-same-line',
            'require-pragma',
            'insert-pragma',
            'no-config',
            'debug-check',
            'list-different',
            'no-editor-config',
            'with-node-modules',
            'write'
          ].indexOf(key) !== -1
        ) {
          if (dashified[key]) {
            output.push(`--${key}`)
          }
        } else {
          output.push(`--${key}`)
          output.push(dashified[key])
        }

        return output
      }, [])
      .concat(dashified.files || [])
  }
}

// utility functions

function dashify(str: string) {
  return str
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\W/g, m => (/[À-ž]/.test(m) ? m : '-'))
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}
