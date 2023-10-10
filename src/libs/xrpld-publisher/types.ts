export interface Validator {
  pk: string
  manifest: string
}

export interface Blob {
  sequence: number
  effective?: string
  expiration: string
  validators: Validator[]
}

export interface VL {
  public_key?: string
  manifest: string
  blob: Blob
  signature?: string
  version?: number
}

export function fromJson(json: any): VL {
  const vl: VL = {
    public_key: json.public_key,
    manifest: json.manifest,
    blob: {
      sequence: json.blob.sequence,
      effective: json.blob.effective,
      expiration: json.blob.expiration,
      validators: json.blob.validators.map((v: any) => ({
        pk: v.validation_public_key,
        manifest: v.manifest,
      })),
    },
    signature: json.signature,
    version: json.version,
  }
  return vl
}

export function toJson(vl: VL): any {
  const json: any = {
    public_key: vl.public_key,
    manifest: vl.manifest,
    blob: {
      sequence: vl.blob.sequence,
      effective: vl.blob.effective,
      expiration: vl.blob.expiration,
      validators: vl.blob.validators.map((v: Validator) => ({
        validation_public_key: v.pk,
        manifest: v.manifest,
      })),
    },
    signature: vl.signature,
    version: vl.version,
  }
  return json
}
