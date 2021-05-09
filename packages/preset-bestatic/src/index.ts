import Berun from '@berun/berun'
import preset from './preset'

export default (berun: Berun, _) => {
  berun
    .use('@berun/runner-mdx')
    .use('@berun/runner-mdx-frontmatter')
    .use(preset)
    .use('@berun/runner-static')
}
