import { WorkflowQuery } from '@/hooks'
import { ClaimArgs } from './types/claim'
import { waitUntilConfirmation } from './utils'
import { AddToast } from '@/hooks/useToastHandler'

export async function handleClaim({
  data: { contributors, bountyId, details },
  workflow,
  addToast,
}: {
  data: ClaimArgs
  workflow: WorkflowQuery
  addToast: AddToast
}) {
  const { logicModule } = workflow.data!

  const mappedContributers = contributors.map((c) => c)

  const hash = await logicModule.write.addClaim.run([
    bountyId,
    mappedContributers,
    details,
  ])

  addToast({
    text: `Waiting for claim proposal confirmation`,
    status: 'success',
  })

  await waitUntilConfirmation(workflow.publicClient, hash)

  return hash
}
