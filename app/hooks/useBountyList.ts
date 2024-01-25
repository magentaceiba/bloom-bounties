'use client'

import { formatUnits, hexToString } from 'viem'
import { useWorkflow } from './useWorkflow'
import { useQuery } from '@tanstack/react-query'
import { FormattedBountyDetails } from '@/lib/types/bounty'

export function useBountyList() {
  const workflow = useWorkflow()

  const ids = useQuery({
    queryKey: ['bondtyIds', workflow.dataUpdatedAt],
    queryFn: () => workflow.data!.contracts.logic.read.listBountyIds(),
    enabled: workflow.isSuccess,
    refetchOnWindowFocus: false,
  })

  const list = useQuery({
    queryKey: ['bountyList', ids.dataUpdatedAt],
    queryFn: () => init(workflow.data!, ids.data!),
    enabled: ids.isSuccess,
    refetchOnWindowFocus: false,
  })

  return { ...list, isConnected: workflow.isConnected }
}

const init = async (
  workflow: NonNullable<ReturnType<typeof useWorkflow>['data']>,
  ids: readonly bigint[]
) => {
  const list = (
    await Promise.all(
      ids.map(async (bountyId: bigint) => {
        const bounty = await workflow.contracts.logic.read.getBountyInformation(
          [bountyId]
        )

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
            workflow.ERC20Decimals
          ),
          maximumPayoutAmount: formatUnits(
            bounty.minimumPayoutAmount,
            workflow.ERC20Decimals
          ),
          symbol: workflow.ERC20Symbol,
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
