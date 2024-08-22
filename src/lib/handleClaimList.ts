import { FormattedClaimDetails } from './types/claim'
import { Workflow } from './getWorkflow'

export const handleClaimList = async (
  workflow: Workflow,
  ids: readonly string[]
) => {
  const list = (
    await Promise.all(
      ids.map(async (claimId) => {
        const claim =
          await workflow.optionalModule.LM_PC_Bounties_v1.read.getClaimInformation.run(
            claimId
          )

        const contributors = claim.contributors.map((c) => c)

        const formattedClaim = {
          ...claim,
          claimId,
          details: claim.details as FormattedClaimDetails,
          contributors,
          symbol: workflow.fundingToken.symbol,
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

export async function handleClaimListForContributorAddress({
  workflow,
  address,
}: {
  workflow: Workflow
  address: `0x${string}`
}) {
  const ids =
    await workflow.optionalModule.LM_PC_Bounties_v1.read.listClaimIdsForContributorAddress.run(
      address!
    )
  const list = await handleClaimList(workflow, ids)
  return list
}
