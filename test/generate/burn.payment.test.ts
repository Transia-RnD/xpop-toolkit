import { Payment } from '@transia/xrpl'
import {
  // Test
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  burnUrl,
  // SDK
  Xrpld,
  readWaitXpopDir,
} from '../../dist/npm/src'
import { parseJsonXpop, saveJsonToFile } from '../utils'
import path from 'path'
import { IssuedCurrencyAmount } from '@transia/xrpl/dist/npm/models/common'
const dir = path.join(process.cwd(), '/mini-network/burn_pnode1/xpop')

describe('Payment - Success Group', () => {
  let testContext: XrplIntegrationTestContext
  let generatedJson: Record<string, any> = {}

  beforeAll(async () => {
    testContext = await setupClient(burnUrl)
    generatedJson['payment'] = {}
  }, 50000)
  afterAll(async () => {
    teardownClient(testContext)
    saveJsonToFile('generated.payment.json', generatedJson)
  })
  it('payment', async () => {
    const gwWallet = testContext.gw
    const aliceWallet = testContext.alice
    const amount: IssuedCurrencyAmount = {
      value: '1',
      currency: 'USD',
      issuer: testContext.gw.classicAddress,
    }
    const builtTx: Payment = {
      TransactionType: 'Payment',
      Account: aliceWallet.classicAddress,
      Destination: gwWallet.classicAddress,
      Amount: amount,
      // @ts-expect-error - leave this alone
      OperationLimit: 21337,
    }
    const result = await Xrpld.submitRippled(
      testContext.client,
      builtTx,
      aliceWallet
    )
    console.log(result)
    const strJsonXpop = await readWaitXpopDir(dir, result.hash, 10)
    generatedJson['payment']['w_seed'] = parseJsonXpop(strJsonXpop)
  }, 10000)
})
