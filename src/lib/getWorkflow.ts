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

  return init({
    publicClient,
    walletClient,
    orchestratorAddress: orchestratorAddress!,
    requestedModules: {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_DepositVault_v1',
      paymentProcessor: 'PP_Simple_v1',
      optionalModules: ['LM_PC_Bounties_v1'],
    },
  })
}

export type Workflow = Awaited<ReturnType<typeof getWorkflow>>
