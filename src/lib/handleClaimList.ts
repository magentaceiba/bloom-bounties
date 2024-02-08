import { WorkflowQuery } from '@/hooks'
import { hexToString, formatUnits } from 'viem'
import { FormattedClaimDetails } from './types/claim'

export const handleClaimList = async (
  workflow: NonNullable<WorkflowQuery['data']>,
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
