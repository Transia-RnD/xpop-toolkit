import fs from 'fs'

export function readJsonXpop(path: string): string {
  const xpop = fs.readFileSync(path)
  return xpop.toString(`hex`).toUpperCase()
}
