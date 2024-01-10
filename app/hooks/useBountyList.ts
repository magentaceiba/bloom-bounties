import { formatUnits, hexToString } from 'viem'
import { useContractRead } from 'wagmi'
import { useWorkflowConfig } from './useWorkflowConfig'
import { useQuery } from '@tanstack/react-query'
import { ParsedBountyDetails } from '@/lib/types/bounty'
import { abis } from '@inverter-network/abis'

export function useBountyList() {
  const workflowConfig = useWorkflowConfig()

  const ids = useContractRead({
    abi: abis.BountyManager.v1,
    address: workflowConfig.data?.addresses.logic,
    functionName: 'listBountyIds',
  })

  const list = useQuery({
    queryKey: ['bountyList', ids.internal.dataUpdatedAt],
    queryFn: async () => {
      const list = await Promise.all(
        (ids.data || []).map(async (bountyId: bigint) => {
          const bounty =
            await workflowConfig.data!.contracts.logic.read.getBountyInformation(
              [bountyId]
            )!

          const newBounty = {
            ...bounty,
            details: <ParsedBountyDetails>(() => {
              try {
                return JSON.parse(hexToString(bounty.details))
              } catch {
                return {}
              }
            }),
            minimumPayoutAmount: formatUnits(
              bounty.minimumPayoutAmount,
              workflowConfig.data!.ERC20Decimals!
            ),
            maximumPayoutAmount: formatUnits(
              bounty.minimumPayoutAmount,
              workflowConfig.data!.ERC20Decimals!
            ),
            symbol: workflowConfig.data!.ERC20Symbol,
          }

          return newBounty
        })
      )

      return list
    },
    enabled: ids.isSuccess,
  })

  return list
}
