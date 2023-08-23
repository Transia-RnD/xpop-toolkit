import {
  Client,
  Wallet,
  NFTokenBurn,
  NFTokenMint,
  convertStringToHex,
  NFTokenMintFlags,
} from '@transia/xrpl'
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
const dir = path.join(process.cwd(), '/mini-network/burn_pnode1/xpop')

describe('Burn - Account Set Group', () => {
  let testContext: XrplIntegrationTestContext
  let generatedJson: Record<string, any> = {}

  beforeAll(async () => {
    testContext = await setupClient(burnUrl)
    generatedJson['nftoken_burn'] = {}
  }, 10000)
  afterAll(async () => {
    teardownClient(testContext)
    saveJsonToFile('generated.nftoken.json', generatedJson)
  })

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
      saveJsonToFile('generated.nftoken_burn.json', generatedJson)
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
      generatedJson['nftoken_burn']['w_seed'] = parseJsonXpop(strJsonXpop)
    }, 10000)
  })
})
