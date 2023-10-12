import * as fs from 'fs'
import path from 'path'
import child_process from 'child_process'

import { fromDateToEffective, fromDaysToExpiration } from './utils'
import { VL } from './types'
import { decode } from '@transia/xrpl'

export class PublisherClient {
  private binPath: string
  private vlPath: string
  private vl: VL

  constructor(manifest: string = null, vlPath: string = null) {
    this.binPath = path.join(process.cwd(), 'bin/validator-list')
    if (vlPath) {
      try {
        this.vlPath = vlPath
        const vlJson = fs.readFileSync(vlPath, 'utf8')
        this.vl = JSON.parse(vlJson)
        this.vl.blob.sequence += 1
      } catch (error) {
        throw error
      }
    }

    if (manifest) {
      this.vlPath = path.join(process.cwd(), 'vl.json')
      this.vl = {
        manifest: manifest,
        blob: {
          sequence: 1,
          validators: [],
          expiration: '',
        },
      }
    }
  }

  public addValidator(manifest: string): void {
    if (!this.vl) {
      throw new Error('Invalid VL')
    }

    if (!this.vl.blob) {
      throw new Error('Invalid Blob')
    }

    const encoded = Buffer.from(manifest, 'base64').toString('hex')
    const decoded = decode(encoded)
    const publicKey = (decoded.PublicKey as string).toUpperCase()
    const newValidator = {
      pk: publicKey,
      manifest: manifest,
    }
    this.vl.blob.validators.push(newValidator)
  }

  public removeValidator(publicKey: string): void {
    if (!this.vl) {
      throw new Error('Invalid VL')
    }

    if (!this.vl.blob) {
      throw new Error('Invalid Blob')
    }

    const validators = this.vl.blob.validators
    const index = validators.findIndex(
      (validator: any) => validator.pk === publicKey
    )
    if (index !== -1) {
      validators.splice(index, 1)
    } else {
      throw new Error('Validator not found')
    }

    this.vl.blob.validators = validators
  }

  public signUnl(
    pk: string,
    effective: number = null,
    expiration: number = null
  ): string {
    if (!this.vl) {
      throw new Error('Invalid VL')
    }

    if (this.vl.blob.validators.length === 0) {
      throw new Error('Must have at least 1 validator')
    }

    if (!effective) {
      effective = fromDateToEffective('01/01/2000')
    }

    if (!expiration) {
      expiration = fromDaysToExpiration(Date.now(), 30)
    }

    const vlManifests = this.vl.blob.validators.map(
      (validator: any) => validator.manifest
    )
    const args = [
      this.binPath,
      'sign',
      '--private_key',
      pk.toString(),
      '--sequence',
      this.vl.blob.sequence.toString(),
      '--expiration',
      expiration.toString(),
      '--manifest',
      this.vl.manifest,
      '--manifests',
      vlManifests.join(','),
    ]
    fs.writeFileSync(this.vlPath, '')
    const out = fs.openSync(this.vlPath, 'w')
    const result = child_process.spawnSync(args[0], args.slice(1), {
      stdio: ['ignore', out, 'ignore'],
    })
    if (result.error) {
      throw result.error
    }

    const vlJson = fs.readFileSync(this.vlPath, 'utf8')
    return vlJson
  }
}
