import { expect, describe, it } from 'bun:test'

import { getWorkflow } from '@inverter-network/sdk'
import testConnectors from './testConnectors'

describe('Approve the fundingManager Token', async () => {
  const { walletClient, publicClient } = testConnectors()

  const { fundingManager, fundingToken } = await getWorkflow({
    publicClient,
    walletClient,
    orchestratorAddress: '0xAC7f5C238d3BEdF5510a84dBEDB8db342E2e7320',
    requestedModules: {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_DepositVault_v1',
      paymentProcessor: 'PP_Simple_v1',
      optionalModules: ['LM_PC_Bounties_v1'],
    },
  })

  it('Approve the fundingManager Token', async () => {
    const res = await fundingToken.module.write.approve.run([
      fundingManager.address!,
      '100',
    ])

    console.log('Approve hash', res)
    expect(res).toBeInstanceOf(Object)
  })
})
