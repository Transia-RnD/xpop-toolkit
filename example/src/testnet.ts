import { Client, Wallet, AccountSet, Import, xrpToDrops } from '@transia/xrpl'
import {
  validateConnection,
  Xrpld,
  getXpopBlob,
  accountSeq,
} from '@transia/xpop-toolkit'

export async function main(): Promise<void> {
  // BURN CLIENT
  const burnUrl = 'wss://testnet.transia.co'
  const burnClient = new Client(burnUrl)
  await burnClient.connect()

  // MINT CLIENT
  const mintUrl = 'wss://hooks-testnet-v3.xrpl-labs.com'
  const mintClient = new Client(mintUrl)
  await mintClient.connect()
  mintClient.networkID = await mintClient.getNetworkID()

  const aliceWallet = Wallet.fromSeed('ss3DnbW3uTbebBLpp42ayuarNfuY4')

  // validate burn syncronization - 1 mins (6 tries at 10 seconds)
  await validateConnection(burnClient, 6)

  // validate mint syncronization - 1 mins (6 tries at 10 seconds)
  await validateConnection(mintClient, 6)

  // ACCOUNT SET OUT
  const burnTx: AccountSet = {
    TransactionType: 'AccountSet',
    Account: aliceWallet.classicAddress,
    // @ts-expect-error - leave this alone
    OperationLimit: mintClient.networkID,
    Fee: xrpToDrops(10),
  }
  const burnResult = await Xrpld.submitRippled(burnClient, burnTx, aliceWallet)
  await burnClient.disconnect()

  // GET XPOP
  const xpopHex = await getXpopBlob(
    'https://testnet.transia.co/xpop/',
    burnResult.hash,
    'url',
    10
  )

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
}

main()
