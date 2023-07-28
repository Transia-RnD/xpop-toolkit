import { SetRegularKey, xrpToDrops } from '@transia/xrpl'
// import { SetRegularKey } from '@transia/xrpl'
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

describe('Burn - Set Regular Key Group', () => {
  let testContext: XrplIntegrationTestContext
  let generatedJson: Record<string, any> = {}

  beforeAll(async () => {
    testContext = await setupClient(burnUrl)
    generatedJson['set_regular_key'] = {}
  }, 10000)
  afterAll(async () => {
    teardownClient(testContext)
    saveJsonToFile('generated.set_regular_key.json', generatedJson)
  })
  // it('Mainnet TT SRK -> Account DNE', async () => {
  //   const aliceWallet = testContext.alice
  //   const bobWallet = testContext.bob
  //   const builtTx: SetRegularKey = {
  //     TransactionType: 'SetRegularKey',
  //     Account: aliceWallet.classicAddress,
  //     RegularKey: bobWallet.classicAddress,
  //     // @ts-expect-error - leave this alone
  //     OperationLimit: 21337,
  //   }
  //   const result = await Xrpld.submitRippled(
  //     testContext.client,
  //     builtTx,
  //     aliceWallet
  //   )
  //   const strJsonXpop = await readWaitXpopDir(dir, result.hash, 10)
  //   generatedJson['set_regular_key']['w_seed'] = parseJsonXpop(strJsonXpop)
  // }, 15000)
  it('Mainnet TT SRK (zero) -> Account DNE', async () => {
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const builtTx: SetRegularKey = {
      TransactionType: 'SetRegularKey',
      Account: aliceWallet.classicAddress,
      RegularKey: bobWallet.classicAddress,
      Fee: xrpToDrops(0),
      // @ts-expect-error - leave this alone
      OperationLimit: 21337,
    }
    const result = await Xrpld.submitRippled(
      testContext.client,
      builtTx,
      aliceWallet
    )
    const strJsonXpop = await readWaitXpopDir(dir, result.hash, 10)
    generatedJson['set_regular_key']['w_seed_zero'] = parseJsonXpop(strJsonXpop)
  }, 15000)
  // it('Mainnet TT SRK (Regular Key) -> Account DNE', async () => {
  //   const aliceWallet = testContext.alice
  //   const bobWallet = testContext.bob
  //   const carolWallet = testContext.carol
  //   const srkTx: SetRegularKey = {
  //     TransactionType: 'SetRegularKey',
  //     Account: aliceWallet.classicAddress,
  //     RegularKey: bobWallet.classicAddress,
  //   }
  //   await Xrpld.submitRippled(testContext.client, srkTx, aliceWallet)

  //   const builtTx: SetRegularKey = {
  //     TransactionType: 'SetRegularKey',
  //     Account: aliceWallet.classicAddress,
  //     RegularKey: carolWallet.classicAddress,
  //     // @ts-expect-error - leave this alone
  //     OperationLimit: 21337,
  //   }
  //   const result = await Xrpld.submitRippled(
  //     testContext.client,
  //     builtTx,
  //     bobWallet
  //   )
  //   const strJsonXpop = await readWaitXpopDir(dir, result.hash, 10)
  //   generatedJson['set_regular_key']['w_regular_key'] =
  //     parseJsonXpop(strJsonXpop)
  // }, 15000)
  // it('Mainnet TT SRK (Signers List) -> Account DNE', async () => {
  //   const aliceWallet = testContext.alice
  //   const bobWallet = testContext.bob
  //   const carolWallet = testContext.carol
  //   const daveWallet = testContext.dave
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
  //   await Xrpld.submitRippled(testContext.client, slsTx, aliceWallet)

  //   const builtTx: SetRegularKey = {
  //     TransactionType: 'SetRegularKey',
  //     Account: aliceWallet.classicAddress,
  //     RegularKey: daveWallet.classicAddress,
  //     // @ts-expect-error - leave this alone
  //     OperationLimit: 21337,
  //   }
  //   const mTx = await testContext.client.autofill(builtTx, 2)
  //   const { tx_blob: tx_blob1 } = bobWallet.sign(mTx, true)
  //   const { tx_blob: tx_blob2 } = carolWallet.sign(mTx, true)
  //   const multisignedTx = multisign([tx_blob1, tx_blob2])
  //   const response = await testContext.client.submit(multisignedTx)
  //   const result = response.result
  //   const strJsonXpop = await readWaitXpopDir(
  //     dir,
  //     result.tx_json.hash as string,
  //     10
  //   )
  //   generatedJson['set_regular_key']['w_signers'] = parseJsonXpop(strJsonXpop)
  // }, 25000)
  // it('Mainnet TT SRK (Empty) -> Account Funded', async () => {
  //   const aliceWallet = testContext.alice
  //   const builtTx: SetRegularKey = {
  //     TransactionType: 'SetRegularKey',
  //     Account: aliceWallet.classicAddress,
  //     // @ts-expect-error - leave this alone
  //     OperationLimit: 21337,
  //   }
  //   const result = await Xrpld.submitRippled(
  //     testContext.client,
  //     builtTx,
  //     aliceWallet
  //   )
  //   const strJsonXpop = await readWaitXpopDir(dir, result.hash, 10)
  //   generatedJson['set_regular_key']['w_seed_empty'] =
  //     parseJsonXpop(strJsonXpop)
  // }, 15000)
  // it('Mainnet TT SRK (Regular Key) (Empty) -> Account Funded', async () => {
  //   const aliceWallet = testContext.alice
  //   const bobWallet = testContext.bob
  //   const srkTx: SetRegularKey = {
  //     TransactionType: 'SetRegularKey',
  //     Account: aliceWallet.classicAddress,
  //     RegularKey: bobWallet.classicAddress,
  //   }
  //   await Xrpld.submitRippled(testContext.client, srkTx, aliceWallet)

  //   const builtTx: SetRegularKey = {
  //     TransactionType: 'SetRegularKey',
  //     Account: aliceWallet.classicAddress,
  //     // @ts-expect-error - leave this alone
  //     OperationLimit: 21337,
  //   }
  //   const result = await Xrpld.submitRippled(
  //     testContext.client,
  //     builtTx,
  //     bobWallet
  //   )
  //   const strJsonXpop = await readWaitXpopDir(dir, result.hash, 10)
  //   generatedJson['set_regular_key']['w_regular_key_empty'] =
  //     parseJsonXpop(strJsonXpop)
  // }, 15000)
  // it('Mainnet TT SRK (Signers List) (Empty) -> Account Funded', async () => {
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
  //   await Xrpld.submitRippled(testContext.client, slsTx, aliceWallet)

  //   const builtTx: SetRegularKey = {
  //     TransactionType: 'SetRegularKey',
  //     Account: aliceWallet.classicAddress,
  //     // @ts-expect-error - leave this alone
  //     OperationLimit: 21337,
  //   }
  //   const mTx = await testContext.client.autofill(builtTx, 2)
  //   const { tx_blob: tx_blob1 } = bobWallet.sign(mTx, true)
  //   const { tx_blob: tx_blob2 } = carolWallet.sign(mTx, true)
  //   const multisignedTx = multisign([tx_blob1, tx_blob2])
  //   const response = await testContext.client.submit(multisignedTx)
  //   const result = response.result
  //   const strJsonXpop = await readWaitXpopDir(
  //     dir,
  //     result.tx_json.hash as string,
  //     10
  //   )
  //   generatedJson['set_regular_key']['w_signers_empty'] =
  //     parseJsonXpop(strJsonXpop)
  // }, 25000)
})
