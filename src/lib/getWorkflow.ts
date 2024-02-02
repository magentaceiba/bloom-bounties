import { abis } from '@inverter-network/abis'
import { getContract } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'

export const getWorkflow = async (
  publicClient: ReturnType<typeof usePublicClient>,
  orchestratorAddress: `0x${string}`,
  walletClientQuery?: ReturnType<typeof useWalletClient>
) => {
  const walletClient = walletClientQuery?.isSuccess
    ? walletClientQuery.data!
    : undefined

  const orchestrator = getContract({
    abi: abis.Orchestrator.v1,
    publicClient,
    address: orchestratorAddress,
  })

  const addresses = {
    orchestrator: orchestratorAddress,
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

  const authorizer = getContract({
    publicClient,
    walletClient,
    address: addresses.authorizer,
    abi: abis.RoleAuthorizer.v1,
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
      authorizer,
    },
    ERC20Decimals,
    ERC20Symbol,
  }
}

export type Workflow = Awaited<ReturnType<typeof getWorkflow>>
