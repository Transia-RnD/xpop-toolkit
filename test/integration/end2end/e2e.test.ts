import { AccountSet, xrpToDrops } from '@transia/xrpl'
import { Import } from '@transia/xrpl'
import {
  // Test
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  burnUrl,
  mintUrl,
  // SDK
  validateConnection,
  Xrpld,
  readWaitXpop,
  accountSeq,
} from '../../../dist/npm/src'
import path from 'path'
import { getTransactionFee } from '../../../src/utils/transaction'

describe('End 2 End - Success Group', () => {
  let burnContext: XrplIntegrationTestContext
  let mintContext: XrplIntegrationTestContext
  beforeAll(async () => {
    burnContext = await setupClient(burnUrl)
    mintContext = await setupClient(mintUrl)
  })
  afterAll(async () => {
    teardownClient(burnContext)
    teardownClient(mintContext)
  })

  it('burn 2 mint - success', async () => {
    // validate burn syncronization - 1 mins (6 tries at 10 seconds)
    await validateConnection(burnContext.client, 6)

    // validate mint syncronization - 1 mins (6 tries at 10 seconds)
    await validateConnection(mintContext.client, 6)

    const aliceWallet = burnContext.alice
    // ACCOUNT SET OUT
    const burnTx: AccountSet = {
      TransactionType: 'AccountSet',
      Account: aliceWallet.classicAddress,
      // @ts-expect-error - leave this alone
      OperationLimit: 21337,
      Fee: xrpToDrops(1),
    }
    const burnResult = await Xrpld.submitRippled(
      burnContext.client,
      burnTx,
      aliceWallet
    )
    const dir = path.join(process.cwd(), '/local-rippled/burn_pnode1/xpop')
    const strJsonXpop = await readWaitXpop(dir, burnResult.hash, 10)
    const xpopHex = strJsonXpop.toString('hex').toUpperCase()

    // IMPORT OUT
    const seq = await accountSeq(
      mintContext.client,
      mintContext.alice.classicAddress
    )
    const mintTx: Import = {
      TransactionType: 'Import',
      Account: aliceWallet.classicAddress,
      Blob: xpopHex,
      Sequence: seq,
    }
    const fee = await getTransactionFee(mintContext.client, mintTx)
    mintTx.Fee = seq === 0 ? '0' : fee
    const mintResult = await Xrpld.submitXahaud(
      mintContext.client,
      mintTx,
      aliceWallet
    )
    console.log(mintResult)
  })
})
