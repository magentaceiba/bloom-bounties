import { WorkflowQuery } from '@/hooks'
import { EditContributersArgs } from './types/claim'
import { parseUnits } from 'viem'
import { AddToast } from '@/hooks/useToastHandler'
import { waitUntilConfirmation } from './utils'

export async function handleEditContributers({
  data: { claimId, contributors },
  workflow,
  addToast,
}: {
  data: EditContributersArgs
  workflow: WorkflowQuery
  addToast: AddToast
}) {
  const { ERC20Decimals } = workflow.data!

  const parsedContributors = contributors.map((c) => ({
    addr: c.addr,
    claimAmount: parseUnits(c.claimAmount!, ERC20Decimals),
  }))

  if (parsedContributors.length === 0) {
    throw new Error('No Contributors Included')
  }

  const config = [BigInt(claimId), parsedContributors] as const

  const hash =
    await workflow.data!.contracts.logic.write.updateClaimContributors(config)

  addToast({
    text: `Waiting for confirmation`,
    status: 'info',
  })

  await waitUntilConfirmation(workflow.publicClient, hash)

  return hash
}
