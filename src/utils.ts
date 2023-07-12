import { Client, ServerInfoRequest } from '@transia/xrpl'
import fs from 'fs'
import path from 'path'
import axios from 'axios'

export function countFiles(dir: string): number {
  try {
    const files = fs.readdirSync(dir) // read directory synchronously
    const uniqueFiles = new Set(files) // filter out duplicates with a set
    let count = 0
    for (const file of uniqueFiles) {
      const fullPath = path.join(dir, file) // get full path to file
      if (fs.statSync(fullPath).isFile()) {
        // check if it's a file (not a directory)
        count++
      }
    }
    return count
  } catch (error) {
    console.error(`Error counting files in directory ${dir}:`, error)
    return -1
  }
}

function readFile(path: string): Buffer {
  try {
    return fs.readFileSync(path)
  } catch (error) {
    console.error(`Error reading file: ${error}`)
    return Buffer.from([])
  }
}

export async function readWaitXpopUrl(
  url: string,
  filename: string,
  retryCount: number
): Promise<Buffer> {
  const fileUrl = `${url}/${filename}`
  let attempt = 1
  while (attempt <= retryCount) {
    try {
      const response = await axios.get(fileUrl, {
        headers: {
          Accept: 'application/json',
        },
      })
      return Buffer.from(JSON.stringify(response.data), 'utf-8')
    } catch (error: any) {
      console.log(`Attempt ${attempt} failed: ${error.message}`)
      await new Promise((res) => setTimeout(res, 2000))
      attempt++
    }
  }
  throw new Error(`Could not find result after ${retryCount} attempts`)
}

export async function readWaitXpopDir(
  dir: string,
  filename: string,
  retryCount: number
): Promise<Buffer> {
  let attempt = 1
  while (attempt <= retryCount) {
    try {
      const files = fs.readdirSync(dir)
      const found = files.find((file) => file === filename)
      if (!found) {
        throw new Error('Result not found')
      }
      return readFile(path.join(dir, filename))
    } catch (error: any) {
      console.log(`Attempt ${attempt} failed: ${error.message}`)
      await new Promise((res) => setTimeout(res, 2000))
      attempt++
    }
  }
  throw new Error(`Could not find result after ${retryCount} attempts`)
}

export async function getXpopBlob(
  hash: string,
  urlOrDir: string,
  type: 'url' | 'dir',
  retryCount: number
): Promise<string> {
  if (typeof hash !== 'string' || hash.length === 0) {
    throw new Error('Invalid hash. Hash must be a non-empty string.')
  }

  if (typeof urlOrDir !== 'string' || urlOrDir.length === 0) {
    throw new Error('Invalid urlOrDir. urlOrDir must be a non-empty string.')
  }

  if (type !== 'url' && type !== 'dir') {
    throw new Error('Invalid type. Type must be either "url" or "dir".')
  }

  if (typeof retryCount !== 'number' || retryCount < 0) {
    throw new Error(
      'Invalid retryCount. retryCount must be a non-negative number.'
    )
  }

  try {
    switch (type) {
      case 'url':
        return (await readWaitXpopUrl(urlOrDir, hash, retryCount))
          .toString('hex')
          .toUpperCase()
      default:
        return (await readWaitXpopDir(urlOrDir, hash, retryCount))
          .toString('hex')
          .toUpperCase()
    }
  } catch (error: any) {
    throw new Error(`Failed to get Xpop Blob: ${error.message}`)
  }
}

export async function validateConnection(
  client: Client,
  retryCount: number
): Promise<void> {
  try {
    let attempt = 1
    while (attempt <= retryCount) {
      const request: ServerInfoRequest = {
        command: 'server_info',
      }
      const response = await client.request(request)
      const peerState: string = response.result.info.server_state
      const peerCompleteLedgers: string = response.result.info.complete_ledgers
      const peerPeerDisconnects: string = response.result.info.peer_disconnects
      const peerPeers: number = response.result.info.peers
      const peerUptime: number = response.result.info.uptime
      const peerQuorum: number = response.result.info.validation_quorum
      if ('validated_ledger' in response.result.info) {
        const peerValidated = true
        const peerSeq = response.result.info.validated_ledger.seq
        console.log(`NODE : VALIDATED - ${peerValidated}`)
        console.log(`NODE : VL SEQUENCE - ${peerSeq}`)
        return
      }
      console.log(`NODE : STATE - ${peerState}`)
      console.log(`NODE : COMPLETED LEDGERS - ${peerCompleteLedgers}`)
      console.log(`NODE : PEER DISCONECTS - ${peerPeerDisconnects}`)
      console.log(`NODE : PEERS - ${peerPeers}`)
      console.log(`NODE : UPTIME - ${peerUptime}`)
      console.log(`NODE : QUORUM - ${peerQuorum}`)
      await new Promise((res) => setTimeout(res, 10000))
      attempt++
    }
    throw new Error(`Could not find result after ${retryCount} attempts`)
  } catch (e) {
    console.log(e)
    return
  }
}
