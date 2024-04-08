import { getWorkflow as init } from '@inverter-network/sdk'
import type {
  UsePublicClientReturnType,
  UseWalletClientReturnType,
} from 'wagmi'

export const getWorkflow = (
  publicClient: UsePublicClientReturnType,
  orchestratorAddress: `0x${string}`,
  walletClientQuery?: UseWalletClientReturnType
) => {
  if (!publicClient) throw new Error('No public client provided')
  const walletClient = walletClientQuery?.isSuccess
    ? walletClientQuery.data!
    : undefined

  console.log('GOT WORKFLOW')

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
