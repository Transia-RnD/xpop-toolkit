import { Client, Wallet, AccountSet, Import, xrpToDrops } from '@transia/xrpl'
import { validateConnection, Xrpld, getXpopBlob } from '@transia/xpop-toolkit'

export async function main(): Promise<void> {
  // BURN CLIENT
  const burnUrl = 'wss://s1.ripple.com'
  const burnClient = new Client(burnUrl)
  await burnClient.connect()

  // MINT CLIENT
  const mintUrl = 'wss://xahau.network'
  const mintClient = new Client(mintUrl)
  await mintClient.connect()
  mintClient.networkID = await mintClient.getNetworkID()

  const myWallet = Wallet.fromSeed('')

  // validate burn syncronization - 1 mins (6 tries at 10 seconds)
  await validateConnection(burnClient, 6)

  // validate mint syncronization - 1 mins (6 tries at 10 seconds)
  await validateConnection(mintClient, 6)

  // ACCOUNT SET OUT
  const burnTx: AccountSet = {
    TransactionType: 'AccountSet',
    Account: myWallet.classicAddress,
    // @ts-expect-error - leave this alone
    OperationLimit: mintClient.networkID,
    Fee: xrpToDrops(10),
  }
  const burnResult = await Xrpld.submitRippled(burnClient, burnTx, myWallet)
  await burnClient.disconnect()

  // GET XPOP
  const xpopHex = await getXpopBlob(
    burnResult.hash,
    'https://xpop.xrpl-labs.com/xpop/',
    'url',
    10
  )

  // IMPORT OUT
  const mintTx: Import = {
    TransactionType: 'Import',
    Account: myWallet.classicAddress,
    Blob: xpopHex.toUpperCase(),
    NetworkID: 21337,
  }
  const mintResult = await Xrpld.submitXahaud(mintClient, mintTx, myWallet)
  console.log(mintResult)
  await mintClient.disconnect()
}

main()
