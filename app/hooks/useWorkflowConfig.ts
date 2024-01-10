'use-client'

import { abis } from '@inverter-network/abis'
import { useQuery } from '@tanstack/react-query'
import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

const defaultOrchestratorAddress = process.env
  .NEXT_PUBLIC_ORCHESTRATOR_ADDRESS as `0x${string}` | undefined

export function useWorkflowConfig(
  orchestratorAddress = defaultOrchestratorAddress
) {
  const publicClient = usePublicClient()

  const workflowConfig = useQuery({
    queryKey: ['workflowConfig', orchestratorAddress, !!publicClient],
    queryFn: async () => await init(publicClient, orchestratorAddress!),
    enabled: !!publicClient && !!orchestratorAddress,
    gcTime: 0,
    staleTime: 60_000,
  })

  return workflowConfig
}

const init = async (
  publicClient: ReturnType<typeof usePublicClient>,
  orchestratorAddress: `0x${string}`
) => {
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
    address: addresses.funding,
    abi: abis.RebasingFundingManager.v1,
  })

  const ERC20Address = await funding.read.token(),
    ERC20 = getContract({
      publicClient,
      address: ERC20Address,
      abi: abis.ERC20.v1,
    }),
    ERC20Symbol = await ERC20.read.symbol(),
    ERC20Decimals = await ERC20.read.decimals()

  const logic = getContract({
    publicClient,
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
  }
}
