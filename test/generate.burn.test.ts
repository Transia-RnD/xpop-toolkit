import {
  Client,
  Wallet,
  // AccountInfoRequest,
  // AccountSet,
  // AccountSetAsfFlags,
  NFTokenBurn,
  NFTokenMint,
  convertStringToHex,
  NFTokenMintFlags,
  // SetRegularKey,
  // SignerListSet,
  // xrpToDrops,
} from '@transia/xrpl'
import {
  // Test
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  burnUrl,
  // SDK
  Xrpld,
  // pay,
  // ICXRP,
  readWaitXpopDir,
} from '../dist/npm/src'
import { parseJsonXpop, saveJsonToFile } from './utils'
// import { buildNFTokenIDFromTx } from './../dist/npm/src/libs/xrpl-helpers/utils'
import path from 'path'
const dir = path.join(process.cwd(), '/mini-network/burn_pnode1/xpop')

// describe('Burn - Account Set Group', () => {
//   let testContext: XrplIntegrationTestContext
//   let generatedJson: Record<string, any> = {}

//   beforeAll(async () => {
//     testContext = await setupClient(burnUrl)
//     generatedJson['account_set'] = {}
//     generatedJson['set_regular_key'] = {}
//     generatedJson['signers_list_set'] = {}
//   }, 10000)
//   afterAll(async () => {
//     teardownClient(testContext)
//     saveJsonToFile('generated.burn.json', generatedJson)
//   })
//   it('account_set - w set flag', async () => {
//     const aliceWallet = testContext.alice
//     const builtTx: AccountSet = {
//       TransactionType: 'AccountSet',
//       Account: aliceWallet.classicAddress,
//       // @ts-expect-error - leave this alone
//       OperationLimit: 21337,
//       SetFlag: AccountSetAsfFlags.asfGlobalFreeze,
//       Fee: '10',
//     }
//     const result = await Xrpld.submitRippled(
//       testContext.client,
//       builtTx,
//       aliceWallet
//     )
//     console.log(result.hash)
//     const strJsonXpop = await readWaitXpopDir(dir, result.hash, 10)
//     generatedJson['account_set']['w_flags'] = parseJsonXpop(strJsonXpop)
//   }, 10000)
//   it('account_set - normal', async () => {
//     const aliceWallet = testContext.alice
//     await pay(
//       testContext.client,
//       new ICXRP(10000),
//       testContext.master,
//       ...[aliceWallet.classicAddress]
//     )
//     const builtTx: AccountSet = {
//       TransactionType: 'AccountSet',
//       Account: aliceWallet.classicAddress,
//       // @ts-expect-error - leave this alone
//       OperationLimit: 21337,
//       Fee: xrpToDrops(10000),
//     }
//     const result = await Xrpld.submitRippled(
//       testContext.client,
//       builtTx,
//       aliceWallet
//     )
//     console.log(result.hash)
//     accountGroup.testCases.push({
//       testName: 'normal',
//       testValue: result.hash,
//     })
//   }, 10000)
//   it('account_set - max', async () => {
//     const aliceWallet = testContext.alice
//     const builtTx: AccountSet = {
//       TransactionType: 'AccountSet',
//       Account: aliceWallet.classicAddress,
//       // @ts-expect-error - leave this alone
//       OperationLimit: 21337,
//       Fee: '999999999999999',
//     }
//     const result = await Xrpld.submitRippled(
//       testContext.client,
//       builtTx,
//       aliceWallet
//     )
//     console.log(result.hash)
//     accountGroup.testCases.push({
//       testName: 'max',
//       testValue: result.hash,
//     })
//   })
// })

// describe('Burn - Set Regular Key Group', () => {
//   let testContext: XrplIntegrationTestContext
//   let generatedJson: Record<string, any> = {}

//   beforeAll(async () => {
//     testContext = await setupClient(burnUrl)
//     generatedJson['account_set'] = {}
//     generatedJson['set_regular_key'] = {}
//     generatedJson['signers_list_set'] = {}
//   }, 10000)
//   afterAll(async () => {
//     teardownClient(testContext)
//     saveJsonToFile('generated.burn.json', generatedJson)
//   })
//   it('regular key - bob -> carol', async () => {
//     const bobWallet = testContext.bob
//     const carolWallet = testContext.carol
//     const builtTx: SetRegularKey = {
//       TransactionType: 'SetRegularKey',
//       Account: bobWallet.classicAddress,
//       RegularKey: carolWallet.classicAddress,
//       // @ts-expect-error - leave this alone
//       OperationLimit: 21337,
//     }
//     const result = await Xrpld.submitRippled(
//       testContext.client,
//       builtTx,
//       bobWallet
//     )
//     const strJsonXpop = await readWaitXpopDir(dir, result.hash, 10)
//     generatedJson['set_regular_key']['bob_carol'] = parseJsonXpop(strJsonXpop)
//   }, 10000)
//   it('regular key - carol -> bob', async () => {
//     const carolWallet = testContext.carol
//     const builtTx: SetRegularKey = {
//       TransactionType: 'SetRegularKey',
//       Account: carolWallet.classicAddress,
//       // @ts-expect-error - leave this alone
//       OperationLimit: 21337,
//     }
//     const result = await Xrpld.submitRippled(
//       testContext.client,
//       builtTx,
//       carolWallet
//     )
//     const strJsonXpop = await readWaitXpopDir(dir, result.hash, 10)
//     generatedJson['set_regular_key']['carol_empty'] = parseJsonXpop(strJsonXpop)
//   }, 10000)
// })

// describe('Burn - Signers List Set Group', () => {
//   let testContext: XrplIntegrationTestContext
//   let generatedJson: Record<string, any> = {}

//   beforeAll(async () => {
//     testContext = await setupClient(burnUrl)
//     generatedJson['account_set'] = {}
//     generatedJson['set_regular_key'] = {}
//     generatedJson['signers_list_set'] = {}
//   }, 10000)
//   afterAll(async () => {
//     teardownClient(testContext)
//     saveJsonToFile('generated.burn.json', generatedJson)
//   })
//   it('signers set list - bob -> carol', async () => {
//     const bobWallet = testContext.bob
//     const carolWallet = testContext.carol
//     const signerList = [
//       { SignerEntry: { Account: carolWallet.classicAddress, SignerWeight: 1 } },
//     ]
//     const builtTx: SignerListSet = {
//       TransactionType: 'SignerListSet',
//       Account: bobWallet.classicAddress,
//       SignerEntries: signerList,
//       SignerQuorum: 1,
//       // @ts-expect-error - leave this alone
//       OperationLimit: 21337,
//     }
//     const result = await Xrpld.submitRippled(
//       testContext.client,
//       builtTx,
//       bobWallet
//     )
//     const strJsonXpop = await readWaitXpopDir(dir, result.hash, 10)
//     generatedJson['signers_list_set']['bob_carol'] = parseJsonXpop(strJsonXpop)
//   }, 10000)
// })

const generateNFTokenHolder = async (
  client: Client,
  wallet: Wallet
): Promise<string> => {
  const builtTx: NFTokenMint = {
    TransactionType: 'NFTokenMint',
    Account: wallet.classicAddress,
    // @ts-expect-error - leave this alone
    OperationLimit: 21337,
    NFTokenTaxon: 1,
    URI: convertStringToHex('ipfs://cid'),
    Flags: NFTokenMintFlags.tfBurnable,
  }
  const result = await Xrpld.submitRippled(client, builtTx, wallet)
  console.log(result)
  // @ts-expect-error - leave this alone
  return result.meta.nftoken_id
}

describe('Burn - NFToken Group', () => {
  let testContext: XrplIntegrationTestContext
  let generatedJson: Record<string, any> = {}
  let nftokenID: string = ''

  beforeAll(async () => {
    testContext = await setupClient(burnUrl)
    generatedJson['nf_token'] = {}
    nftokenID = await generateNFTokenHolder(
      testContext.client,
      testContext.alice
    )
    console.log(nftokenID)
  }, 50000)
  afterAll(async () => {
    teardownClient(testContext)
    saveJsonToFile('generated.burn.json', generatedJson)
  })
  it('burn nftoken', async () => {
    const aliceWallet = testContext.alice
    const builtTx: NFTokenBurn = {
      TransactionType: 'NFTokenBurn',
      Account: aliceWallet.classicAddress,
      Owner: aliceWallet.classicAddress,
      // @ts-expect-error - leave this alone
      OperationLimit: 21337,
      NFTokenID: nftokenID,
    }
    const result = await Xrpld.submitRippled(
      testContext.client,
      builtTx,
      aliceWallet
    )
    console.log(result)
    const strJsonXpop = await readWaitXpopDir(dir, result.hash, 10)
    generatedJson['nftoken_burn']['simple'] = parseJsonXpop(strJsonXpop)
  }, 10000)
})
