import { FormattedBountyDetails } from './types/bounty'
import { WorkflowQuery } from '@/hooks'
import { waitUntilConfirmation } from './utils'
import { AddToast } from '@/hooks/useToastHandler'

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
  addToast,
}: {
  data: BountyPostArgs
  workflow: WorkflowQuery
  addToast: AddToast
}) => {
  if (!workflow.data) return

  const { details, minimumPayoutAmount, maximumPayoutAmount } = data

  const newDetails = {
    ...details,
    creatorAddress: workflow.address,
    date: new Date().toISOString(),
  } satisfies FormattedBountyDetails

  const bounty = await workflow.data.logicModule.write.addBounty.run([
    minimumPayoutAmount,
    maximumPayoutAmount,
    newDetails,
  ])

  addToast({
    text: 'Waiting for bounty post confirmation',
    status: 'success',
  })

  await waitUntilConfirmation(workflow.publicClient, bounty)

  return bounty
}
