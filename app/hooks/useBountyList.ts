'use client'

import { formatUnits, hexToString } from 'viem'
import { useWorkflow } from './useWorkflow'
import { useQuery } from '@tanstack/react-query'
import { FormattedBountyDetails } from '@/lib/types/bounty'

export function useBountyList() {
  const workflowConfig = useWorkflow()

  const ids = useQuery({
    queryKey: ['bondtyIds', workflowConfig.dataUpdatedAt],
    queryFn: () => workflowConfig.data!.contracts.logic.read.listBountyIds(),
    enabled: workflowConfig.isSuccess,
    refetchOnWindowFocus: false,
  })

  const list = useQuery({
    queryKey: ['bountyList', ids.dataUpdatedAt],
    queryFn: () => init(workflowConfig.data!, ids.data!),
    enabled: ids.isSuccess,
    refetchOnWindowFocus: false,
  })

  return list
}

const init = async (
  workflowConfig: NonNullable<ReturnType<typeof useWorkflow>['data']>,
  ids: readonly bigint[]
) => {
  const list = (
    await Promise.all(
      ids.map(async (bountyId: bigint) => {
        const bounty =
          await workflowConfig.contracts.logic.read.getBountyInformation([
            bountyId,
          ])

        let details: FormattedBountyDetails
        try {
          details = JSON.parse(hexToString(bounty.details))
        } catch {
          return null
        }

        const newBounty = {
          ...bounty,
          details,
          minimumPayoutAmount: formatUnits(
            bounty.minimumPayoutAmount,
            workflowConfig.ERC20Decimals
          ),
          maximumPayoutAmount: formatUnits(
            bounty.minimumPayoutAmount,
            workflowConfig.ERC20Decimals
          ),
          symbol: workflowConfig.ERC20Symbol,
        }

        return newBounty
      })
    )
  ).filter((bounty): bounty is NonNullable<typeof bounty> => bounty !== null)

  return list.sort(
    (a, b) =>
      new Date(b.details.date).getTime() - new Date(a.details.date).getTime()
  )
}
