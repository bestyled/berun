import { FuseBox as FuseBoxConfig } from './FuseBox'
export { FuseBoxConfig }

export const FuseBox = berun => {
  berun.fusebox = new FuseBoxConfig()
}
