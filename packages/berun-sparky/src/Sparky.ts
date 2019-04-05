import { SparkTask } from './SparkTask'
import { SparkFlow } from './SparkFlow'
import { SparkyFilePatternOptions } from './SparkyFilePattern'
import { each } from 'realm-utils'
import { Log } from './Log'
import {
  SparkyContext,
  SparkyContextClass,
  getSparkyContext
} from './SparkyContext'

export const log = new Log()

export class Sparky {
  static launch = false
  static testMode = false
  static tasks = new Map<string, SparkTask>()

  public static flush() {
    this.tasks = new Map<string, SparkTask>()
  }

  /** Append dependency(ies) to task or create new task if it doesnt exist */
  public static append(name: string, ...args) {
    let dependencies: string[] = []
    let secondArgument = arguments[1]

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
      help: msg => (sparkTask.help = msg)
    }
  }

  /** Create a new task */
  public static task(name: string, ...args): { help: (msg: string) => void } {
    let callback: any
    let dependencies: string[] = []
    let secondArgument = arguments[1]

    if (Array.isArray(secondArgument) || typeof secondArgument === 'string') {
      dependencies = ([] as string[]).concat(secondArgument)
      callback = arguments[2]
    } else {
      callback = arguments[1]
    }
    const sparkTask = new SparkTask(name, dependencies, callback)
    this.tasks.set(name, sparkTask)
    // launching the task on next tick
    if (this.launch === false && this.testMode === false) {
      this.launch = true
      process.nextTick(async () => {
        await this.start()
      })
    }
    return {
      help: msg => (sparkTask.help = msg)
    }
  }

  public static context(
    target: () =>
      | { [key: string]: any }
      | (new () => any)
      | { [key: string]: any }
  ): SparkyContextClass {
    this.tasks.clear(); 
    return SparkyContext(target)
  }

  public static src(
    glob: string | string[],
    opts?: SparkyFilePatternOptions
  ): SparkFlow {
    const flow = new SparkFlow()
    let globs = Array.isArray(glob) ? glob : [glob]
    return flow.glob(globs, opts)
  }

  public static watch(
    glob: string | string[],
    opts?: SparkyFilePatternOptions,
    fn?: any
  ) {
    const flow = new SparkFlow()
    let globs = Array.isArray(glob) ? glob : [glob]
    return flow.watch(globs, opts, fn)
  }

  /* public static fuse(fn: (context: any) => FuseBoxOptions) {
		process.nextTick(() => {
			const sparkyContext = getSparkyContext();
			sparkyContext._getFuseBoxOptions = () => FuseBox.init(fn(sparkyContext));
			Object.defineProperty(sparkyContext, "fuse", {
				get: () => {
					if (!sparkyContext._fuseInstance) {
						sparkyContext._fuseInstance = sparkyContext._getFuseBoxOptions();
					}
					return sparkyContext._fuseInstance;
				},
			});
			return sparkyContext._fuseInstance;
		});
	} */

  public static init(paths: string[]) {
    const flow = new SparkFlow()
    flow.createFiles(paths)
    return flow
  }

  public static async exec(...args: Array<string | (() => any)>) {
    for (const task of args) {
      if (typeof task === 'string') {
        return await this.resolve(task)
      } else {
        return await task()
      }
    }
  }

  public static async start(tname?: string): Promise<any> {
    let start = process.hrtime()
    const taskName = tname || process.argv[2] || 'default'

    if (taskName.toLowerCase() === 'help') {
      Sparky.showHelp()
      return Promise.resolve()
    }

    if (!this.tasks.get(taskName)) {
      log.echoWarning(`Task with such name ${taskName} was not found!`)
      return Promise.reject('Task not found: ' + taskName)
    }
    log.echoSparkyTaskStart(taskName)

    const task = this.tasks.get(taskName)!
    await Promise.all([
      // resolve parallel dependencies
      Promise.all(task.parallelDependencies.map(name => this.resolve(name))),
      // resolve waterfal dependencies
      each(task.waterfallDependencies, name => this.resolve(name))
    ])
    let res
    if (typeof task.fn === 'function') {
      res = await this.execute(task.fn(getSparkyContext()))
    }
    log.echoSparkyTaskEnd(taskName, process.hrtime(start))
    return res
  }

  private static execute(result: any) {
    if (result instanceof SparkFlow) {
      return result.exec()
    }
    return result
  }

  private static async resolve(name: string) {
    if (!this.tasks.has(name)) {
      throw new Error(`Task with such name ${name} was not found!`)
    }
    return await this.start(name)
  }

  private static showHelp() {
    log
      .echoPlain('')
      .groupHeader('Usage')
      .echoPlain(`  ${process.argv[0]} [TASK] [OPTIONS...]`)
      .echoPlain('')
      .groupHeader('Available tasks')

    // Figure out the length of the longest task so we can have a nice margin
    const maxTaskNameLength = Array.from(Sparky.tasks.keys()).reduce(
      (acc, taskName) => Math.max(acc, taskName.length),
      0
    )

    // Display each task name and its help message
    Sparky.tasks.forEach((task, taskName) => {
      const marginLength = maxTaskNameLength - taskName.length + 2
      log.echoSparkyTaskHelp(taskName + ' '.repeat(marginLength), task.help)
    })
  }
}
