import docsearchDefault, {
  docsearchSync as docsearchSyncDefault
} from './docsearch'

export default function docsearch(src, options = {}) {
  return docsearchDefault(src, {
    rehypePlugins: [],
    compilers: [],
    ...options
  })
}

export const docsearchSync = function docsearchSync(src, options = {}) {
  return docsearchSyncDefault(src, {
    rehypePlugins: [],
    compilers: [],
    ...options
  })
}
