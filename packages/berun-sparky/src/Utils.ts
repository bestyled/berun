import * as fs from 'fs'
import * as fsExtra from 'fs-extra'
import * as path from 'path'
import { Config } from './Config'

export function ensureAbsolutePath(userPath: string) {
  if (!path.isAbsolute(userPath)) {
    return path.join(Config.PROJECT_ROOT, userPath)
  }
  return userPath
}

export function replaceExt(npath, ext): string {
  if (typeof npath !== 'string') {
    return npath
  }

  if (npath.length === 0) {
    return npath
  }
  if (/\.[a-z0-9]+$/i.test(npath)) {
    return npath.replace(/\.[a-z0-9]+$/i, ext)
  } else {
    return npath + ext
  }
}

export function isClass(obj) {
  const isCtorClass =
    obj.constructor && obj.constructor.toString().substring(0, 5) === 'class'
  if (obj.prototype === undefined) {
    return isCtorClass
  }
  const isPrototypeCtorClass =
    obj.prototype.constructor &&
    obj.prototype.constructor.toString &&
    obj.prototype.constructor.toString().substring(0, 5) === 'class'
  return isCtorClass || isPrototypeCtorClass
}

export function getDateTime() {
  const data = new Date()
  let hours: string | number = data.getHours()
  let minutes: string | number = data.getMinutes()
  let seconds: string | number = data.getSeconds()
  hours = hours < 10 ? `0${hours}` : hours
  minutes = minutes < 10 ? `0${minutes}` : minutes
  seconds = seconds < 10 ? `0${seconds}` : seconds
  return `${hours}:${minutes}:${seconds}`
}
export function ensureDir(userPath: string) {
  if (!path.isAbsolute(userPath)) {
    userPath = path.join(Config.PROJECT_ROOT, userPath)
  }
  userPath = path.normalize(userPath)

  fsExtra.ensureDirSync(userPath)
  return userPath
}

export function string2RegExp(obj: any) {
  let escapedRegEx = obj
    .replace(/\*/g, '@')

    .replace(/[.?*+[\]-]/g, '\\$&')
    .replace(/@@/g, '.*', 'i')
    .replace(/@/g, '\\w{1,}', 'i')

  if (escapedRegEx.indexOf('$') === -1) {
    escapedRegEx += '$'
  }
  return new RegExp(escapedRegEx)
}

/**
 * Does two things:
 * - If a relative path is given,
 *  it is assumed to be relative to appRoot and is then made absolute
 * - Ensures that the directory containing the userPath exits (creates it if needed)
 */
export function ensureUserPath(userPath: string) {
  if (!path.isAbsolute(userPath)) {
    userPath = path.join(Config.PROJECT_ROOT, userPath)
  }
  userPath = path.normalize(userPath)
  let dir = path.dirname(userPath)

  fsExtra.ensureDirSync(dir)
  return userPath
}
