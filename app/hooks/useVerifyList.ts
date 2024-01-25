'use client'

import { formatUnits, hexToString } from 'viem'
import { useWorkflow } from './useWorkflow'
import { useQuery } from '@tanstack/react-query'
import { FormattedClaimDetails } from '@/lib/types/claim'

export function useVerifyList() {
  const workflow = useWorkflow()

  const ids = useQuery({
    queryKey: ['bondtyIds', workflow.dataUpdatedAt],
    queryFn: () => workflow.data!.contracts.logic.read.listClaimIds(),
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
      ids.map(async (claimId: bigint) => {
        const claim = await workflow.contracts.logic.read.getClaimInformation([
          claimId,
        ])

        let details: FormattedClaimDetails
        try {
          details = JSON.parse(hexToString(claim.details))
        } catch {
          return null
        }

        const contributors = claim.contributors.map((c) => ({
          address: c.addr,
          amount: formatUnits(c.claimAmount, workflow.ERC20Decimals),
        }))

        const formattedClaim = {
          ...claim,
          details,
          contributors,
          symbol: workflow.ERC20Symbol,
        }

        return formattedClaim
      })
    )
  ).filter((bounty): bounty is NonNullable<typeof bounty> => bounty !== null)

  return list.sort(
    (a, b) =>
      new Date(b.details.date).getTime() - new Date(a.details.date).getTime()
  )
}
