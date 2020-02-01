import { FluentMap, FluentSet, FluentValue } from '@berun/fluent'

export class TSLint<PARENT> extends FluentMap<PARENT> {
  extends = new FluentSet(this)

  rulesDirectory = new FluentSet(this)

  rules = new FluentMap(this)

  jsRules = new FluentMap(this)

  defaultSeverity = FluentValue<this, any>()

  linterOptions = FluentValue<this, any>()

  constructor(parent?: PARENT, name?: string) {
    super(parent)
    this.extendfluent()
  }
}
