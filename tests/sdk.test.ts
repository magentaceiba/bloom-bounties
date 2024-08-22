import { expect, describe, it } from 'bun:test'

import { getWorkflow } from '@inverter-network/sdk'
import { usePublicClient, useWalletClient } from 'wagmi'

describe('Get A Module', async () => {
  const publicClient = usePublicClient()
  const walletClient = useWalletClient()

  if (!publicClient) throw new Error('No public client provided')

  const { optionalModule, authorizer, fundingManager } = await getWorkflow({
    publicClient,
    walletClient: walletClient.data ?? undefined,
    orchestratorAddress: '0xAC7f5C238d3BEdF5510a84dBEDB8db342E2e7320',
    requestedModules: {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_DepositVault_v1',
      paymentProcessor: 'PP_Simple_v1',
      optionalModules: ['LM_PC_Bounties_v1'],
    },
  })

  it('logicModule read getBountyInformation', async () => {
    const res =
      await optionalModule.LM_PC_Bounties_v1.read.getBountyInformation.run('51')
    expect(res).toBeInstanceOf(Object)
  })

  it('logicModule simulate addBounty', async () => {
    const simRes =
      await optionalModule.LM_PC_Bounties_v1.simulate.addBounty.run([
        '100',
        '2000',
        ['this is an inverter project'],
      ])

    expect(simRes).toBeString()
  })

  it('fundingManager read token', async () => {
    const res = await fundingManager.read.token.run()
    expect(res).toBeString()
  })

  it('fundingManager simulate deposit', async () => {
    const simRes = await fundingManager.simulate.deposit.run('100')
    expect(simRes).toBeInstanceOf(Array)
  })

  it('authorizer read owner role', async () => {
    const res = await authorizer.read.getAdminRole.run()
    expect(res).toBeString()
  })

  it('authorizer simulate grantRole', async () => {
    const simRes = await authorizer.simulate.grantRole.run([
      '0x3078303100000000000000000000000000000000000000000000000000000000',
      '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
    ])
    expect(simRes).toBeArray()
  })
})
