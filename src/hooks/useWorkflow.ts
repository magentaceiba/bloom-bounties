'use client'

import { getWorkflow } from '@/lib/getWorkflow'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient, useWalletClient } from 'wagmi'

const defaultOrchestratorAddress = process.env
  .NEXT_PUBLIC_ORCHESTRATOR_ADDRESS as `0x${string}` | undefined

export function useWorkflow(orchestratorAddress = defaultOrchestratorAddress) {
  const publicClient = usePublicClient()
  const walletClient = useWalletClient()

  const workflowConfig = useQuery({
    queryKey: [
      'workflowConfig',
      orchestratorAddress,
      publicClient.chain,
      walletClient.internal.dataUpdatedAt,
    ],
    queryFn: () =>
      getWorkflow(publicClient, orchestratorAddress!, walletClient),
    enabled: !!publicClient.chain && !!orchestratorAddress,
    refetchOnWindowFocus: false,
  })
  return {
    ...workflowConfig,
    isConnected: walletClient.isSuccess,
    address: walletClient.data?.account.address,
    publicClient,
  }
}

export type WorkflowQuery = ReturnType<typeof useWorkflow>
