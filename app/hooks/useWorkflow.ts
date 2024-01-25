'use client'

import { abis } from '@inverter-network/abis'
import { useQuery } from '@tanstack/react-query'
import { getContract } from 'viem'
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
      !!publicClient,
      walletClient.internal.dataUpdatedAt,
    ],
    queryFn: () => init(publicClient, orchestratorAddress!, walletClient),
    enabled: !!publicClient && !!orchestratorAddress,
    refetchOnWindowFocus: false,
  })

  return workflowConfig
}

const init = async (
  publicClient: ReturnType<typeof usePublicClient>,
  orchestratorAddress: `0x${string}`,
  walletClientQuery: ReturnType<typeof useWalletClient>
) => {
  const walletClient = walletClientQuery.isSuccess
    ? walletClientQuery.data!
    : undefined

  const orchestrator = getContract({
    abi: abis.Orchestrator.v1,
    publicClient,
    address: orchestratorAddress,
  })

  const addresses = {
    authorizer: await orchestrator.read.authorizer(),
    funding: await orchestrator.read.fundingManager(),
    payment: await orchestrator.read.paymentProcessor(),
    logic: await orchestrator.read.findModuleAddressInOrchestrator([
      'BountyManager',
    ]),
  }

  const funding = getContract({
    publicClient,
    walletClient,
    address: addresses.funding,
    abi: abis.RebasingFundingManager.v1,
  })

  const ERC20Address = await funding.read.token(),
    ERC20 = getContract({
      publicClient,
      walletClient,
      address: ERC20Address,
      abi: abis.ERC20.v1,
    }),
    ERC20Symbol = await ERC20.read.symbol(),
    ERC20Decimals = await ERC20.read.decimals()

  const logic = getContract({
    publicClient,
    walletClient,
    address: addresses.logic,
    abi: abis.BountyManager.v1,
  })

  return {
    addresses: { ...addresses, ERC20: ERC20Address },
    contracts: {
      ERC20,
      orchestrator,
      funding,
      logic,
    },
    ERC20Decimals,
    ERC20Symbol,
    isConnected: !!walletClient,
  }
}
