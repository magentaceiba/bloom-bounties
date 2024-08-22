import { FormattedBountyDetails } from './types/bounty'
import { WorkflowQuery } from '@/hooks'
import type { toast as Toast } from 'sonner'

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
  toast,
}: {
  data: BountyPostArgs
  workflow: WorkflowQuery
  toast: typeof Toast
}) => {
  if (!workflow.data) return

  const { details, minimumPayoutAmount, maximumPayoutAmount } = data

  const newDetails = {
    ...details,
    creatorAddress: workflow.address,
    date: new Date().toISOString(),
  } satisfies FormattedBountyDetails

  const bounty =
    await workflow.data.optionalModule.LM_PC_Bounties_v1.write.addBounty.run([
      minimumPayoutAmount,
      maximumPayoutAmount,
      newDetails,
    ])

  toast.success('Waiting for bounty post confirmation')

  await workflow.publicClient?.waitForTransactionReceipt({ hash: bounty })

  return bounty
}
