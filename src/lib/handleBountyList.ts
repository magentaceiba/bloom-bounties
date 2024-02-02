import { WorkflowQuery } from '@/hooks'
import { FormattedBountyDetails } from './types/bounty'
import { formatUnits, hexToString } from 'viem'

export const handleBountyList = async (
  workflow: NonNullable<WorkflowQuery['data']>,
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
          id: String(bountyId),
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
