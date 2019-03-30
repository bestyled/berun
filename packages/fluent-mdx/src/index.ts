import { Mdx as MdxConfig } from './Mdx'

export { MdxConfig }

export const Mdx = berun => {
  berun.mdx = new MdxConfig()
}
