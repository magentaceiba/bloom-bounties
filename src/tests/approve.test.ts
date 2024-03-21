import { expect, describe, it } from 'bun:test'

import { getWorkflow } from '@inverter-network/sdk'
import testConnectors from './testConnectors'

describe('Approve the fundingManager Token', async () => {
  const { walletClient, publicClient } = testConnectors()

  const {
    logicModule,
    authorizer,
    fundingManager,
    paymentProcessor,
    erc20Module,
  } = await getWorkflow({
    publicClient,
    walletClient,
    orchestratorAddress: '0xAC7f5C238d3BEdF5510a84dBEDB8db342E2e7320',
    workflowOrientation: {
      authorizer: {
        name: 'RoleAuthorizer',
        version: 'v1.0',
      },
      fundingManager: {
        name: 'RebasingFundingManager',
        version: 'v1.0',
      },
      logicModule: {
        name: 'BountyManager',
        version: 'v1.0',
      },
      paymentProcessor: {
        name: 'SimplePaymentProcessor',
        version: 'v1.0',
      },
    },
  })

  it('Approve the fundingManager Token', async () => {
    const res = await erc20Module.write.approve.run([
      fundingManager.address!,
      '100',
    ])

    console.log('Approve hash', res)
    expect(res).toBeInstanceOf(Object)
  })
})
