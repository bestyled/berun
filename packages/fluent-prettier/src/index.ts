import { Prettier as PrettierConfig } from './Prettier'
export { PrettierConfig }

export const Prettier = berun => {
  berun.prettier = new PrettierConfig()
}
