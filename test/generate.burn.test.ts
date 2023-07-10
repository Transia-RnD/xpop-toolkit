import {
  // AccountInfoRequest,
  AccountSet,
  SetRegularKey,
  SignerListSet,
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
} from '../dist/npm/src'

describe('Burn - Success Group', () => {
  let testContext: XrplIntegrationTestContext
  // let generatedJson: Test[]

  beforeAll(async () => {
    testContext = await setupClient(burnUrl)
    // generatedJson = []
  })
  afterAll(async () => {
    teardownClient(testContext)
    // saveJsonToFile('generated.json', generatedJson)
  })

  it('burn - successful account set burn', async () => {
    // ACCOUNT SET
    const aliceWallet = testContext.alice
    const builtTx: AccountSet = {
      TransactionType: 'AccountSet',
      Account: aliceWallet.classicAddress,
      // @ts-expect-error - leave this alone
      OperationLimit: 21337,
      Fee: xrpToDrops(1000),
    }
    const result = await Application.testTx(
      testContext.client,
      builtTx,
      aliceWallet
    )
    console.log(result.hash)
    expect('false').toBe('true')
  })
  it('regular key - successful regular key', async () => {
    // REGULAR KEY
    const aliceWallet = testContext.alice
    const builtTx: SetRegularKey = {
      TransactionType: 'SetRegularKey',
      Account: aliceWallet.classicAddress,
      RegularKey: aliceWallet.classicAddress,
      // @ts-expect-error - leave this alone
      OperationLimit: 21337,
    }
    const result = await Application.testTx(
      testContext.client,
      builtTx,
      aliceWallet
    )
    console.log(result.hash)
    expect('false').toBe('true')
  })
  it('signers set list - successful signers set list', async () => {
    // SIGNER LIST SET
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const signerList = [
      { SignerEntry: { Account: bobWallet.classicAddress, SignerWeight: 1 } },
    ]
    const builtTx: SignerListSet = {
      TransactionType: 'SignerListSet',
      Account: aliceWallet.classicAddress,
      SignerEntries: signerList,
      SignerQuorum: 1,
      // @ts-expect-error - leave this alone
      OperationLimit: 21337,
    }
    const result = await Xrpld.submitRippled(
      testContext.client,
      builtTx,
      aliceWallet
    )
    console.log(result.hash)
  })
})
