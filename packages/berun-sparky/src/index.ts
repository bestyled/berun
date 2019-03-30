import { Sparky } from './Sparky'
import { SparkyContext } from './SparkyContext'

export { npmPublish, tsc, bumpVersion } from './SparkyUtils'

Sparky.launch = true // Do not autorun default task in this version

export const src: typeof Sparky.src = Sparky.src.bind(Sparky)
export const watch: typeof Sparky.watch = Sparky.watch.bind(Sparky)
export const append: typeof Sparky.append = Sparky.append.bind(Sparky)
export const task: typeof Sparky.task = Sparky.task.bind(Sparky)
export const context: typeof SparkyContext = Sparky.context.bind(Sparky)
export const exec: typeof Sparky.exec = Sparky.exec.bind(Sparky)
export const init: typeof Sparky.init = Sparky.init.bind(Sparky)
// export const fuse: typeof Sparky.fuse = Sparky.fuse.bind(Sparky);
