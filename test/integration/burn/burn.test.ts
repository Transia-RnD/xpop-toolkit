import {
  AccountInfoRequest,
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
  Application,
} from '../../../dist/npm/src'
import { countFiles } from '../../../'
import path from 'path'

// Error Group

// Success Group
// Burn: tesSUCCESS: successful account set burn

describe('Burn - Load Test', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(burnUrl)
  })
  afterAll(async () => teardownClient(testContext))

  // it('burn - test 10 xpop transactions', async () => {
  //   let cycle = 0
  //   const tries = 10
  //   const aliceWallet = testContext.alice
  //   const request: AccountInfoRequest = {
  //     command: 'account_info',
  //     account: aliceWallet.classicAddress as string,
  //   }
  //   const response = await testContext.client.request(request)
  //   const seq = response.result.account_data.Sequence
  //   console.log(seq)

  //   cycle = 1
  //   for (let i = 0; i < tries; i++) {
  //     // ACCOUNT SET
  //     console.log('ACCOUNT SET')
  //     const builtTx: AccountSet = {
  //       TransactionType: 'AccountSet',
  //       Account: aliceWallet.classicAddress,
  //       // @ts-expect-error - leave this alone
  //       OperationLimit: 21337,
  //       Fee: xrpToDrops(1),
  //       Sequence: seq + i,
  //     }
  //     const result = await Application.testTx(
  //       testContext.client,
  //       builtTx,
  //       aliceWallet
  //     )
  //     console.log(result.hash)
  //     // expect('false').toBe('true')
  //   }
  //   const dir = path.join(process.cwd(), 'mini-network/burn_pnode1/xpop')
  //   const xpopCount = countFiles(dir)
  //   expect(xpopCount / 2).toBe(cycle * tries)
  // })
})

// describe('Burn - Success Group', () => {
//   let testContext: XrplIntegrationTestContext

//   beforeAll(async () => {
//     testContext = await setupClient(burnUrl)
//   })
//   afterAll(async () => teardownClient(testContext))

//   // it('burn - successful account set burn', async () => {
//   //   // ACCOUNT SET
//   //   const aliceWallet = testContext.alice
//   //   const builtTx: AccountSet = {
//   //     TransactionType: 'AccountSet',
//   //     Account: aliceWallet.classicAddress,
//   //     // @ts-expect-error - leave this alone
//   //     OperationLimit: 21337,
//   //     Fee: xrpToDrops(1000),
//   //   }
//   //   const result = await Application.testTx(
//   //     testContext.client,
//   //     builtTx,
//   //     aliceWallet
//   //   )
//   //   console.log(result.hash)
//   //   expect('false').toBe('true')
//   // })
//   it('regular key - successful regular key', async () => {
//     // REGULAR KEY
//     const aliceWallet = testContext.alice
//     const builtTx: SetRegularKey = {
//       TransactionType: 'SetRegularKey',
//       Account: aliceWallet.classicAddress,
//       RegularKey: aliceWallet.classicAddress,
//       // @ts-expect-error - leave this alone
//       OperationLimit: 21337,
//     }
//     const result = await Application.testTx(
//       testContext.client,
//       builtTx,
//       aliceWallet
//     )
//     console.log(result.hash)
//     expect('false').toBe('true')
//   })
//   // it('signers set list - successful signers set list', async () => {
//   //   // SIGNER LIST SET
//   //   const aliceWallet = testContext.alice
//   //   const bobWallet = testContext.bob
//   //   const signerList = [
//   //     { SignerEntry: { Account: bobWallet.classicAddress, SignerWeight: 1 } },
//   //   ]
//   //   const builtTx: SignerListSet = {
//   //     TransactionType: 'SignerListSet',
//   //     Account: aliceWallet.classicAddress,
//   //     SignerEntries: signerList,
//   //     SignerQuorum: 1,
//   //     // @ts-expect-error - leave this alone
//   //     OperationLimit: 21337,
//   //   }
//   //   const result = await Application.testTx(
//   //     testContext.client,
//   //     builtTx,
//   //     aliceWallet
//   //   )
//   //   console.log(result.hash)
//   //   expect('false').toBe('true')
//   // })
// })
