import {
  AccountSet,
  LedgerResponse,
  ServerInfoResponse,
  xrpToDrops,
} from '@transia/xrpl'
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
  readWaitXpopDir,
  accountSeq,
  getTransactionFee,
} from '../../../dist/npm/src'
import path from 'path'

describe('Header - Success Group', () => {
  let burnContext: XrplIntegrationTestContext
  let mintContext: XrplIntegrationTestContext
  beforeAll(async () => {
    burnContext = await setupClient(burnUrl)
    mintContext = await setupClient(mintUrl, true)
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

    const preLedger: LedgerResponse = await mintContext.client.request({
      command: 'ledger',
      transactions: true,
      ledger_index: 'validated',
    })

    const aliceWallet = burnContext.alice
    // ACCOUNT SET OUT
    const burnXrp = 1
    const burnTx: AccountSet = {
      TransactionType: 'AccountSet',
      Account: aliceWallet.classicAddress,
      // @ts-expect-error - leave this alone
      OperationLimit: 21337,
      Fee: xrpToDrops(burnXrp),
    }
    // await validateXpopTx(burnTx)
    const burnResult = await Xrpld.submitRippled(
      burnContext.client,
      burnTx,
      aliceWallet
    )
    const dir = path.join(process.cwd(), '/mini-network/burn_pnode1/xpop')
    const strJsonXpop = await readWaitXpopDir(dir, burnResult.hash, 10)
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
    await Xrpld.submitXahaud(mintContext.client, mintTx, aliceWallet)
    const postLedger: LedgerResponse = await mintContext.client.request({
      command: 'ledger',
      transactions: true,
      ledger_index: 'validated',
    })
    const serverInfo: ServerInfoResponse = await mintContext.client.request({
      command: 'server_info',
    })
    const postCoinsInt = parseInt(postLedger.result.ledger.total_coins)
    const preCoinsInt = parseInt(preLedger.result.ledger.total_coins)
    const burnDrops = parseInt(xrpToDrops(burnXrp))
    const feeDrops = parseInt(
      xrpToDrops(
        serverInfo.result.info.validated_ledger?.base_fee_xrp as number
      )
    )
    const finalCoins = preCoinsInt + burnDrops - feeDrops
    expect(postCoinsInt).toBe(finalCoins)
  })
})
