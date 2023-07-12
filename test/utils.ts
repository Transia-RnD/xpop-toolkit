import fs from 'fs'

export interface TestGroup {
  account_set: TestCase[]
  testCases: TestCase[]
}

export interface TestCaseGroup {
  groupName: string
  testCases: TestCase[]
}

export interface TestCase {
  testName: string
  testValue: string | Record<string, unknown>
}

export function saveJsonToFile(
  filePath: string,
  tests: Record<string, any>
): void {
  const json = JSON.stringify(tests, (key, value) => {
    // Replace any forward slashes with an empty string
    if (typeof value === 'string') {
      return value.replace(/\//g, '') // Replace all occurrences of '/'
    }
    return value
  })
  fs.writeFileSync(filePath, json)
}

export function parseJsonXpop(strJsonXpop: Buffer) {
  return JSON.parse(JSON.stringify(strJsonXpop.toString('utf8')))
}
