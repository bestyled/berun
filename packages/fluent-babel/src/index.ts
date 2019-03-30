import { Babel as BabelConfig } from './Babel'

export { BabelConfig }

export const Babel = berun => {
  berun.babel = new BabelConfig()
}
