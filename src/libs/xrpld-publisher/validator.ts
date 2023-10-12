import path from 'path'
import * as fs from 'fs'
import { execSync } from 'child_process'
import { readJson, readTxt } from './utils'

export class ValidatorClient {
  name = '' // node1 | node2 | signer
  keystorePath = ''
  binPath = ''
  keyPath = ''

  constructor(name: string) {
    this.name = name
    this.keystorePath = path.join(process.cwd(), `keystore`)
    this.binPath = path.join(process.cwd(), `bin/validator-keys`)
    this.keyPath = path.join(this.keystorePath, `${this.name}/key.json`)
  }

  getKeys(): any {
    try {
      return readJson(this.keyPath)
    } catch (e) {
      // console.log(e)
      return null
    }
  }

  async createKeys(): Promise<string> {
    const keys = this.getKeys()
    if (keys) {
      return keys
    }
    const args1 = [this.binPath, 'create_keys', '--keyfile', this.keyPath]
    execSync(args1.join(' '))
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // @ts-expect-error -- ingonre
    return readJson(this.keyPath)
  }

  async setDomain(domain: string): Promise<void> {
    const args1 = [
      this.binPath,
      'set_domain',
      domain,
      '--keyfile',
      this.keyPath,
    ]
    execSync(args1.join(' '))
  }

  async createToken(): Promise<string> {
    const token_path = path.join(this.keystorePath, `${this.name}/token.txt`)
    const out = fs.openSync(token_path, 'w')
    const args = [this.binPath, 'create_token', '--keyfile', this.keyPath]
    execSync(args.join(' '), { stdio: [0, out, 2] }) // Redirect stdout to 'out'
    fs.closeSync(out)
    // @ts-expect-error -- ignore
    return readTxt(token_path)
  }

  async createManifest(): Promise<string> {
    const manifest_path = path.join(
      this.keystorePath,
      `${this.name}/manifest.txt`
    )
    const out = fs.openSync(manifest_path, 'w')
    const args = [
      this.binPath,
      'show_manifest',
      'base64',
      '--keyfile',
      this.keyPath,
    ]
    execSync(args.join(' '), { stdio: [0, out, 2] }) // Redirect stdout to 'out'
    fs.closeSync(out)
    // @ts-expect-error -- ingonre
    return readTxt(manifest_path)
  }

  readManifest(): string {
    const manifest_path = path.join(
      this.keystorePath,
      `${this.name}/manifest.txt`
    )
    const manifest = readTxt(manifest_path)
    return manifest[1].replace('\n', '')
  }
}
