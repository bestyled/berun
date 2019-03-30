import { Tdx as TdxConfig } from './Tdx'

export { TdxConfig }

export const Tdx = berun => {
  berun.tdx = new TdxConfig()
}
