import { burnUrl } from '../../../src/utils/serverUrl'
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
} from '../../../src/utils/setup'

describe('Application.setup env', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(burnUrl)
  })
  afterAll(async () => teardownClient(testContext))

  it('setup - env', async () => {
    expect('test').toEqual('test')
  })
})
