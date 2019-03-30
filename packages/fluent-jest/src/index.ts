import { Jest as JestConfig } from './Jest'
export { Transform } from './Transform'

export { JestConfig }

export const Jest = berun => {
  berun.jest = new JestConfig()
}
