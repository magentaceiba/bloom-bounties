'use client'

import { formatUnits, hexToString } from 'viem'
import { useWorkflow } from './useWorkflow'
import { useQuery } from '@tanstack/react-query'
import { FormattedClaimDetails } from '@/lib/types/claim'

export function useClaimList() {
  const workflow = useWorkflow()

  const ids = useQuery({
    queryKey: ['verifyIds', workflow.dataUpdatedAt],
    queryFn: () => workflow.data!.contracts.logic.read.listClaimIds(),
    enabled: workflow.isSuccess,
    refetchOnWindowFocus: false,
  })

  const list = useQuery({
    queryKey: ['verifyList', ids.dataUpdatedAt],
    queryFn: () => handleClaimList(workflow.data!, ids.data!),
    enabled: ids.isSuccess,
    refetchOnWindowFocus: false,
  })

  return { ...list, isConnected: workflow.isConnected, workflow }
}

const handleClaimList = async (
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
          addr: c.addr,
          claimAmount: formatUnits(c.claimAmount, workflow.ERC20Decimals),
          include: true,
        }))

        const formattedClaim = {
          ...claim,
          claimId,
          details,
          contributors,
          symbol: workflow.ERC20Symbol,
        }

        return formattedClaim
      })
    )
  ).filter((c): c is NonNullable<typeof c> => c !== null)

  return list.sort(
    (a, b) =>
      new Date(b.details.date).getTime() - new Date(a.details.date).getTime()
  )
}
