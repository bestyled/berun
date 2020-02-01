/* eslint-disable prefer-destructuring */
import { each } from 'realm-utils'
import { SparkTask } from './SparkTask'
import { SparkFlow } from './SparkFlow'
import { SparkyFilePatternOptions } from './SparkyFilePattern'
import { Log } from './Log'
import {
  SparkyContext,
  SparkyContextClass,
  getSparkyContext
} from './SparkyContext'

export const log = new Log()

export class Sparky {
  launch = false

  testMode = false

  tasks = new Map<string, SparkTask>()

  public flush() {
    this.tasks = new Map<string, SparkTask>()
  }

  /** Append dependency(ies) to task or create new task if it doesnt exist */
  public append(name: string, ...rest) {
    let dependencies: string[] = []
    const secondArgument = rest[0]

    if (Array.isArray(secondArgument) || typeof secondArgument === 'string') {
      dependencies = ([] as string[]).concat(secondArgument)
    } else {
      throw new Error(
        'Second argument to taskAddDependency must be string or array of strings'
      )
    }

    let sparkTask: SparkTask

    if (!this.tasks.has(name)) {
      sparkTask = new SparkTask(name, dependencies, null)
      this.tasks.set(name, sparkTask)
    } else {
      sparkTask = this.tasks.get(name) as SparkTask
      sparkTask.addDependencies(dependencies)
    }

    return {
      help: (msg: string) => {
        sparkTask.help = msg
      }
    }
  }

  /** Create a new task */
  public task(name: string, ...rest): { help: (msg: string) => void } {
    let callback: any
    let dependencies: string[] = []
    const secondArgument = rest[0]

    if (Array.isArray(secondArgument) || typeof secondArgument === 'string') {
      dependencies = ([] as string[]).concat(secondArgument)
      callback = rest[1]
    } else {
      callback = rest[0]
    }
    const sparkTask = new SparkTask(name, dependencies, callback)
    this.tasks.set(name, sparkTask)
    // launching the task on next tick
    if (this.launch !== false && this.testMode === false) {
      this.launch = true
      process.nextTick(async () => {
        await this.start()
      })
    }
    return {
      help: (msg: string) => {
        sparkTask.help = msg
      }
    }
  }

  public context(
    target: () =>
      | { [key: string]: any }
      | (new () => any)
      | { [key: string]: any }
  ): SparkyContextClass {
    this.tasks.clear()
    return SparkyContext(target)
  }

  public src(
    glob: string | string[],
    opts?: SparkyFilePatternOptions
  ): SparkFlow {
    const flow = new SparkFlow()
    const globs = Array.isArray(glob) ? glob : [glob]
    return flow.glob(globs, opts)
  }

  public watch(
    glob: string | string[],
    opts?: SparkyFilePatternOptions,
    fn?: any
  ) {
    const flow = new SparkFlow()
    const globs = Array.isArray(glob) ? glob : [glob]
    return flow.watch(globs, opts, fn)
  }

  public init(paths: string[]) {
    const flow = new SparkFlow()
    flow.createFiles(paths)
    return flow
  }

  public async exec(...args: Array<string | (() => Promise<void>)>) {
    // eslint-disable-next-line no-restricted-syntax
    for (const task of args) {
      if (typeof task === 'string') {
        // eslint-disable-next-line no-await-in-loop
        await this.resolve(task)
      } else {
        // eslint-disable-next-line no-await-in-loop
        await task()
      }
    }
  }

  public async start(tname?: string): Promise<any> {
    const start = process.hrtime()
    const taskName = tname || process.argv[2] || 'default'

    if (taskName.toLowerCase() === 'help') {
      this.showHelp()
      return Promise.resolve()
    }

    if (!this.tasks.get(taskName)) {
      log.echoWarning(`Task with such name ${taskName} was not found!`)
      return Promise.reject(new Error(`Task not found: ${taskName}`))
    }
    log.echoSparkyTaskStart(taskName)

    const task = this.tasks.get(taskName)!
    try {
      await Promise.all([
        // resolve parallel dependencies
        Promise.all(task.parallelDependencies.map(name => this.resolve(name))),
        // resolve waterfal dependencies
        each(task.waterfallDependencies, name => this.resolve(name))
      ])
    } catch (ex) {
      console.error(ex)
      process.exit(1)
    }
    let res
    if (typeof task.fn === 'function') {
      res = await this.execute(task.fn(getSparkyContext()))
    }
    log.echoSparkyTaskEnd(taskName, process.hrtime(start))
    return res
  }

  private execute(result: any) {
    if (result instanceof SparkFlow) {
      return result.exec()
    }
    return result
  }

  private resolve(name: string) {
    if (!this.tasks.has(name)) {
      throw new Error(`Task with such name ${name} was not found!`)
    }
    return this.start(name)
  }

  private showHelp() {
    log
      .echoPlain('')
      .groupHeader('Usage')
      .echoPlain(`  ${process.argv[0]} [TASK] [OPTIONS...]`)
      .echoPlain('')
      .groupHeader('Available tasks')

    // Figure out the length of the longest task so we can have a nice margin
    const maxTaskNameLength = Array.from(this.tasks.keys()).reduce(
      (acc, taskName) => Math.max(acc, taskName.length),
      0
    )

    // Display each task name and its help message
    this.tasks.forEach((task, taskName) => {
      const marginLength = maxTaskNameLength - taskName.length + 2
      log.echoSparkyTaskHelp(taskName + ' '.repeat(marginLength), task.help)
    })
  }
}
