import { Import, xrpToDrops } from '@transia/xrpl'
import { Application } from '../../../src/Application'
import { burnUrl, mintUrl } from '../../../src'
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
} from '../../../src/utils/setup'

// Error Group

// Success Group
// Mint: tesSUCCESS: successful account set burn

describe('Mint - Success Group', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(mintUrl)
  })
  afterAll(async () => teardownClient(testContext))

  it('mint - successful account set mint', async () => {
    const xpopHex = readJsonXpop('xpop')
    console.log(xpopHex)

    // ACCOUNT SET
    const aliceWallet = testContext.alice
    const builtTx: Import = {
      TransactionType: 'Import',
      Account: aliceWallet.classicAddress,
      Blob: xpopHex,
    }
    const result = await Application.testV3Tx(
      testContext.client,
      builtTx,
      aliceWallet
    )
    console.log('result')
    expect('false').toBe('true')
  })
})
