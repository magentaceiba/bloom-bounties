import { parseUnits, stringToHex } from 'viem'
import { FormattedBountyDetails } from './types/bounty'
import { WorkflowQuery } from '@/hooks/useWorkflow'
import { waitUntilConfirmation } from './utils'

export type BountyPostArgs = {
  details: {
    title: string
    description: string
    url: string
  }
  minimumPayoutAmount: string
  maximumPayoutAmount: string
}

export const handleBountyPost = async ({
  data,
  workflow,
}: {
  data: BountyPostArgs
  workflow: WorkflowQuery
}) => {
  if (!workflow.data) return

  const { details, minimumPayoutAmount, maximumPayoutAmount } = data

  const parsedDetails = stringToHex(
    JSON.stringify({
      ...details,
      creatorAddress: workflow.address,
      date: new Date().toISOString(),
    } satisfies FormattedBountyDetails)
  )

  const args = [
    // Minimum Payout
    parseUnits(minimumPayoutAmount, workflow.data.ERC20Decimals),
    // Maximum Payout
    parseUnits(maximumPayoutAmount, workflow.data.ERC20Decimals),
    // Details
    parsedDetails,
    // '0x0',
  ] as const

  const bounty = await workflow.data.contracts.logic.write.addBounty(args)

  await waitUntilConfirmation(workflow.publicClient, bounty)

  return bounty
}
