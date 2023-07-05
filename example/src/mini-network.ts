import { Client, AccountSet, Import, xrpToDrops } from '@transia/xrpl'
import {
  validateConnection,
  Xrpld,
  readWaitXpop,
  accountSeq,
} from '@transia/xpop-toolkit'
import {
  MASTER_WALLET,
  ALICE_WALLET,
} from '@transia/xpop-toolkit/dist/npm/src/libs/xrpl-helpers/constants'
import {
  balance,
  fund,
  ICXRP,
} from '@transia/xpop-toolkit/dist/npm/src/libs/xrpl-helpers'
import path from 'path'

export async function main(): Promise<void> {
  // BURN CLIENT
  const burnUrl = 'ws://localhost:6006'
  const burnClient = new Client(burnUrl)
  await burnClient.connect()

  // MINT CLIENT
  const mintUrl = 'ws://localhost:6016'
  const mintClient = new Client(mintUrl)
  await mintClient.connect()
  mintClient.networkID = await mintClient.getNetworkID()

  const wallet = MASTER_WALLET

  const aliceWallet = ALICE_WALLET

  // validate burn syncronization - 1 mins (6 tries at 10 seconds)
  await validateConnection(burnClient, 6)

  // validate mint syncronization - 1 mins (6 tries at 10 seconds)
  await validateConnection(mintClient, 6)

  if ((await balance(burnClient, aliceWallet.classicAddress)) < 2000) {
    await fund(
      burnClient,
      wallet,
      new ICXRP(2000),
      ...[aliceWallet.classicAddress]
    )
  }

  if ((await balance(mintClient, aliceWallet.classicAddress)) < 2000) {
    await fund(
      mintClient,
      wallet,
      new ICXRP(2000),
      ...[aliceWallet.classicAddress]
    )
  }

  // ACCOUNT SET OUT
  const burnTx: AccountSet = {
    TransactionType: 'AccountSet',
    Account: aliceWallet.classicAddress,
    // @ts-expect-error - leave this alone
    OperationLimit: mintClient.networkID,
    Fee: xrpToDrops(10),
  }
  const burnResult = await Xrpld.submitRippled(burnClient, burnTx, aliceWallet)
  console.log(burnResult)
  const hash = burnResult.hash
  const dir = path.join(process.cwd(), '../mini-network/burn_pnode1/xpop')
  const strJsonXpop = await readWaitXpop(dir, hash, 10)
  const xpopHex = strJsonXpop.toString('hex').toUpperCase()

  // IMPORT OUT
  const seq = await accountSeq(mintClient, aliceWallet.classicAddress)
  const mintTx: Import = {
    TransactionType: 'Import',
    Account: aliceWallet.classicAddress,
    Blob: xpopHex,
    Sequence: seq,
    Fee: '0',
  }
  const mintResult = await Xrpld.submitXahaud(mintClient, mintTx, aliceWallet)
  console.log(mintResult)

  await mintClient.disconnect()
  await burnClient.disconnect()
}

main()
