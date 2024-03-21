import { getWorkflow as init } from '@inverter-network/sdk'
import { usePublicClient, useWalletClient } from 'wagmi'

export const getWorkflow = async (
  publicClient: ReturnType<typeof usePublicClient>,
  orchestratorAddress: `0x${string}`,
  walletClientQuery?: ReturnType<typeof useWalletClient>
) => {
  const walletClient = walletClientQuery?.isSuccess
    ? walletClientQuery.data!
    : undefined

  return init({
    publicClient,
    walletClient,
    orchestratorAddress: orchestratorAddress!,
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
}

export type Workflow = Awaited<ReturnType<typeof getWorkflow>>
