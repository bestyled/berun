import * as log from 'fliplog'
import * as prettyTime from 'pretty-time'
import { getDateTime } from './Utils'

export class Log {
  private static deferred: Function[] = []

  public timeStart = process.hrtime()
  public printLog: any = true
  public showBundledFiles: boolean = true
  public debugMode: any = false
  public spinner: any

  public static defer(fn: Function) {
    Log.deferred.push(fn)
  }
  constructor({ doLog, debugMode } = { doLog: true, debugMode: false }) {
    this.printLog = doLog
    this.debugMode = debugMode

    log.filter(arg => {
      const debug = this.debugMode
      const level = this.printLog
      const hasTag = tag => arg.tags.includes(tag)
      const levelHas = tag =>
        debug ||
        (level &&
          level.includes &&
          level.includes(tag) &&
          !level.includes('!' + tag))

      if (level === false) {
        return false
      }

      if (level === true && debug === true) {
        return null
      }

      if (level === 'error') {
        if (!hasTag('error')) {
          return false
        }
      }
      if (hasTag('magic')) {
        if (!levelHas('magic')) {
          return false
        }
      }
      if (hasTag('filelist')) {
        if (!levelHas('filelist')) {
          return false
        }
      }

      return null
    })

    process.nextTick(() => {
      if (this.printLog) {
        Log.deferred.forEach(x => x(this))
      }
      Log.deferred = []
    })
  }

  public echoSparkyTaskStart(taskName: string) {
    const gray = log.chalk().gray
    const magenta = log.chalk().magenta
    const str = ['[', gray(getDateTime()), ']', ' Starting']
    str.push(` '${magenta(taskName)}' `)
    console.log(str.join(''))
    return this
  }

  public echoSparkyTaskEnd(taskName, took: [number, number]) {
    const gray = log.chalk().gray
    const magenta = log.chalk().magenta
    const str = ['[', gray(getDateTime()), ']', ' Resolved']
    str.push(` '${magenta(taskName)}' `, 'after ')
    str.push(`${gray(prettyTime(took, 'ms'))}`)
    console.log(str.join(''))
    return this
  }

  public echoSparkyTaskHelp(taskName: string, taskHelp: string) {
    log
      .ansi()
      .write(' ')
      .cyan(taskName)
      .white(taskHelp)
      .echo()
  }

  public groupHeader(str: string) {
    log
      .color('bold.underline')
      .text(`${str}`)
      .echo()
    return this
  }

  public echoPlain(str: string) {
    log.text(str).echo()
    return this
  }

  public echoStatus(str: string) {
    log
      .title(`→`)
      .cyan(`${str}`)
      .echo()
    return this
  }

  public echoWarning(str: string) {
    log.yellow(`  → WARNING ${str}`).echo()
    return this
  }
}
