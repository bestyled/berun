/**
 * Copyright (c) 2018 Brent Jackson under MIT license from mdx-go
 * Portions copyright (c) 2018 BeStatic Contributors
 */

import { a } from './a'
import { blockquote } from './blockquote'
import { h1, h2, h3, h4, h5, h6 } from './h1-6'
import { hr } from './hr'
import { img } from './img'
// import { input } from './input'
import { ol } from './ol'
import { p } from './p'
// import { /* code, inlineCode*/ } from './code'
import { table } from './table'
import { ul } from './ul'

export const styledScope = {
  a,
  blockquote,
  /* code, assume handled by prism or similar */
  /* inlineCode, assume handled by prism or similar */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  img,
  p,
  ul,
  ol,
  table
  // input for check lists
}

export default styledScope
