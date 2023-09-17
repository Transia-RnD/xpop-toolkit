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

describe('Burn - Import Seq Group', () => {
  let testContext: XrplIntegrationTestContext
  let generatedJson: Record<string, any> = {}

  beforeAll(async () => {
    testContext = await setupClient(burnUrl)
    generatedJson['import_seq'] = {}
  }, 10000)
  afterAll(async () => {
    teardownClient(testContext)
    saveJsonToFile('generated.import_seq.json', generatedJson)
  })
  // it('account_set - first vl first tx', async () => {
  //   const aliceWallet = testContext.alice
  //   const builtTx: AccountSet = {
  //     TransactionType: 'AccountSet',
  //     Account: aliceWallet.classicAddress,
  //     // @ts-expect-error - leave this alone
  //     OperationLimit: 21337,
  //     Fee: xrpToDrops(1000),
  //   }
  //   const result = await Xrpld.submitRippled(
  //     testContext.client,
  //     builtTx,
  //     aliceWallet
  //   )
  //   console.log(result.hash)
  //   const xpop = await readWaitXpopDir(dir, result.hash, 10)
  //   generatedJson['import_seq']['unl_seq_1_1'] = parseJsonXpop(xpop)
  // }, 15000)
  // it('account_set - first vl second tx', async () => {
  //   const aliceWallet = testContext.alice
  //   const builtTx: AccountSet = {
  //     TransactionType: 'AccountSet',
  //     Account: aliceWallet.classicAddress,
  //     // @ts-expect-error - leave this alone
  //     OperationLimit: 21337,
  //     Fee: xrpToDrops(1000),
  //   }
  //   const result = await Xrpld.submitRippled(
  //     testContext.client,
  //     builtTx,
  //     aliceWallet
  //   )
  //   console.log(result.hash)
  //   const xpop = await readWaitXpopDir(dir, result.hash, 10)
  //   generatedJson['import_seq']['unl_seq_1_2'] = parseJsonXpop(xpop)
  // }, 15000)
  it('account_set - second vl first tx', async () => {
    const bobWallet = testContext.bob
    const builtTx: AccountSet = {
      TransactionType: 'AccountSet',
      Account: bobWallet.classicAddress,
      // @ts-expect-error - leave this alone
      OperationLimit: 21337,
      Fee: xrpToDrops(1000),
    }
    const result = await Xrpld.submitRippled(
      testContext.client,
      builtTx,
      bobWallet
    )
    console.log(result.hash)
    const xpop = await readWaitXpopDir(dir, result.hash, 10)
    generatedJson['import_seq']['unl_seq_2_1'] = parseJsonXpop(xpop)
  }, 15000)
})
