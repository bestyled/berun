// FIX-DEPENDENCIES
require.resolve('@berun/runner-tdx')
require.resolve('@berun/runner-tdx-frontmatter')
require.resolve('@berun/runner-static')

import Berun from '@berun/berun'
import preset from './preset'

export default (berun: Berun, _) => {
  berun
    .use('@berun/runner-tdx')
    .use('@berun/runner-tdx-frontmatter')
    .use(preset)
    .use('@berun/runner-static')
}
