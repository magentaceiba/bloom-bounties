'use client'

import { getWorkflow } from '@/lib/getWorkflow'
import { useQuery } from '@tanstack/react-query'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

const defaultOrchestratorAddress = process.env
  .NEXT_PUBLIC_ORCHESTRATOR_ADDRESS as `0x${string}` | undefined

export default function useWorkflowHandler(
  orchestratorAddress = defaultOrchestratorAddress
) {
  const publicClient = usePublicClient()
  const walletClient = useWalletClient()
  const { address, chainId } = useAccount()

  const workflowConfig = useQuery({
    queryKey: ['workflowConfig', orchestratorAddress, chainId, address],
    queryFn: () => {
      return getWorkflow(publicClient!, orchestratorAddress!, walletClient)
    },
    enabled:
      !!chainId &&
      !!orchestratorAddress &&
      (walletClient.isSuccess || walletClient.isError),
    refetchOnWindowFocus: false,
  })
  return {
    ...workflowConfig,
    isConnected: walletClient.isSuccess,
    address: walletClient.data?.account.address,
    publicClient,
  }
}

export type WorkflowQuery = ReturnType<typeof useWorkflowHandler>
