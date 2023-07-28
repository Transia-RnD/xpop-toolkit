import {
  AccountSet,
  // AccountSetAsfFlags,
  // SetRegularKey,
  // SignerListSet,
  // multisign,
  xrpToDrops,
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
} from '../../dist/npm/src'
import { parseJsonXpop, saveJsonToFile } from '../utils'
import path from 'path'
const dir = path.join(process.cwd(), '/mini-network/burn_pnode1/xpop')

describe('Burn - Account Set Group', () => {
  let testContext: XrplIntegrationTestContext
  let generatedJson: Record<string, any> = {}

  beforeAll(async () => {
    testContext = await setupClient(burnUrl)
    generatedJson['account_set'] = {}
  }, 10000)
  afterAll(async () => {
    teardownClient(testContext)
    saveJsonToFile('generated.account_set.json', generatedJson)
  })
  // it('account_set - min', async () => {
  //   const aliceWallet = testContext.alice
  //   const builtTx: AccountSet = {
  //     TransactionType: 'AccountSet',
  //     Account: aliceWallet.classicAddress,
  //     // @ts-expect-error - leave this alone
  //     OperationLimit: 21337,
  //     SetFlag: AccountSetAsfFlags.asfGlobalFreeze,
  //     Fee: '10',
  //   }
  //   const result = await Xrpld.submitRippled(
  //     testContext.client,
  //     builtTx,
  //     aliceWallet
  //   )
  //   console.log(result.hash)
  //   const strJsonXpop = await readWaitXpopDir(dir, result.hash, 10)
  //   generatedJson['account_set']['min'] = parseJsonXpop(strJsonXpop)
  // }, 10000)
  // it('account_set - max', async () => {
  //   const aliceWallet = testContext.alice
  //   const builtTx: AccountSet = {
  //     TransactionType: 'AccountSet',
  //     Account: aliceWallet.classicAddress,
  //     // @ts-expect-error - leave this alone
  //     OperationLimit: 21337,
  //     Fee: '999999999999999',
  //   }
  //   const result = await Xrpld.submitRippled(
  //     testContext.client,
  //     builtTx,
  //     aliceWallet
  //   )
  //   console.log(result.hash)
  //   accountGroup.testCases.push({
  //     testName: 'max',
  //     testValue: result.hash,
  //   })
  // })
  it('account_set - w/ seed', async () => {
    const aliceWallet = testContext.alice
    const builtTx: AccountSet = {
      TransactionType: 'AccountSet',
      Account: aliceWallet.classicAddress,
      // @ts-expect-error - leave this alone
      OperationLimit: 21337,
      Fee: xrpToDrops(1000),
    }
    const result = await Xrpld.submitRippled(
      testContext.client,
      builtTx,
      aliceWallet
    )
    console.log(result.hash)
    const xpop = await readWaitXpopDir(dir, result.hash, 10)
    generatedJson['account_set']['w_seed'] = parseJsonXpop(xpop)
  }, 15000)
  // it('account_set - w set flag', async () => {
  //   const aliceWallet = testContext.alice

  //   const builtTx: AccountSet = {
  //     TransactionType: 'AccountSet',
  //     Account: aliceWallet.classicAddress,
  //     // @ts-expect-error - leave this alone
  //     OperationLimit: 21337,
  //     SetFlag: AccountSetAsfFlags.asfGlobalFreeze,
  //     Fee: '10',
  //   }
  //   const result = await Xrpld.submitRippled(
  //     testContext.client,
  //     builtTx,
  //     aliceWallet
  //   )
  //   console.log(result.hash)
  //   const strJsonXpop = await readWaitXpopDir(dir, result.hash, 10)
  //   generatedJson['account_set']['w_flags'] = parseJsonXpop(strJsonXpop)
  // }, 10000)
  // it('account_set - regular key -> DNE', async () => {
  //   const aliceWallet = testContext.alice
  //   const bobWallet = testContext.bob

  //   const srkTx: SetRegularKey = {
  //     TransactionType: 'SetRegularKey',
  //     Account: aliceWallet.classicAddress,
  //     RegularKey: bobWallet.classicAddress,
  //   }
  //   await Xrpld.submitRippled(testContext.client, srkTx, aliceWallet)

  //   const tx: AccountSet = {
  //     TransactionType: 'AccountSet',
  //     Account: aliceWallet.classicAddress,
  //     // @ts-expect-error - leave this alone
  //     OperationLimit: 21337,
  //     Fee: xrpToDrops(1000),
  //   }
  //   const result = await Xrpld.submitRippled(testContext.client, tx, bobWallet)
  //   const xpop = await readWaitXpopDir(dir, result.hash, 10)
  //   generatedJson['account_set']['w_regular_key'] = parseJsonXpop(xpop)
  // }, 15000)
  // it('account_set - signers list set -> DNE', async () => {
  //   const aliceWallet = testContext.alice
  //   const bobWallet = testContext.bob
  //   const carolWallet = testContext.carol
  //   const signerList = [
  //     { SignerEntry: { Account: bobWallet.classicAddress, SignerWeight: 1 } },
  //     { SignerEntry: { Account: carolWallet.classicAddress, SignerWeight: 1 } },
  //   ]
  //   const slsTx: SignerListSet = {
  //     TransactionType: 'SignerListSet',
  //     Account: aliceWallet.classicAddress,
  //     SignerEntries: signerList,
  //     SignerQuorum: 2,
  //   }
  //   await Xrpld.submitRippled(testContext.client, slsTx, bobWallet)

  //   const builtTx: AccountSet = {
  //     TransactionType: 'AccountSet',
  //     Account: aliceWallet.classicAddress,
  //     // @ts-expect-error - leave this alone
  //     OperationLimit: 21337,
  //     SetFlag: AccountSetAsfFlags.asfGlobalFreeze,
  //   }
  //   const accountSetTx = await testContext.client.autofill(builtTx, 2)
  //   console.log('AccountSet transaction is ready to be multisigned:')
  //   console.log(accountSetTx)
  //   const { tx_blob: tx_blob1 } = bobWallet.sign(accountSetTx, true)
  //   const { tx_blob: tx_blob2 } = carolWallet.sign(accountSetTx, true)
  //   const multisignedTx = multisign([tx_blob1, tx_blob2])
  //   console.log(multisignedTx)

  //   const response = await testContext.client.submit(multisignedTx)
  //   const result = response.result
  //   console.log(result)

  //   // const result = await Xrpld.submitRippled(
  //   //   testContext.client,
  //   //   builtTx,
  //   //   bobWallet // signing w/ bob
  //   // )
  //   console.log(result.tx_json.hash)
  //   const strJsonXpop = await readWaitXpopDir(
  //     dir,
  //     result.tx_json.hash as string,
  //     10
  //   )
  //   generatedJson['account_set']['w_signers_dne'] = parseJsonXpop(strJsonXpop)
  // }, 25000)
})
