import * as fs from 'fs'

const rippledTs = 946684800

export function fromDateToEffective(date_str: string): number {
  const effectiveTs =
    new Date(date_str.split('/').reverse().join('-')).getTime() / 1000
  return effectiveTs - rippledTs
}

export function fromDaysToExpiration(days: number): number {
  const currentTime: number = Math.floor(Date.now() / 1000) - rippledTs
  return currentTime + 86400 * days // expires in x days
}

export function encodeBlob(blob: object): string {
  return Buffer.from(JSON.stringify(blob)).toString('base64')
}

export function decodeBlob(blob: string): object {
  return JSON.parse(Buffer.from(blob, 'base64').toString('utf8'))
}
export function readTxt(path: string): string[] {
  return fs.readFileSync(path, 'utf8').split('\n')
}

export function readFile(path: string): string {
  return fs.readFileSync(path, 'utf8')
}

export function readJson(path: string): object {
  return JSON.parse(fs.readFileSync(path, 'utf8'))
}

export function writeJson(data: object, path: string): boolean {
  fs.writeFileSync(path, JSON.stringify(data))
  return true
}
