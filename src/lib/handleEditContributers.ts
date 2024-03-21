import { WorkflowQuery } from '@/hooks'
import { EditContributersArgs } from './types/claim'
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
  const parsedContributors = contributors.map((c) => c)

  if (parsedContributors.length === 0) {
    throw new Error('No Contributors Included')
  }

  const hash =
    await workflow.data!.logicModule.write.updateClaimContributors.run([
      claimId,
      parsedContributors,
    ])

  addToast({
    text: `Waiting for edit contibutors confirmation`,
    status: 'info',
  })

  await waitUntilConfirmation(workflow.publicClient, hash)

  return hash
}
