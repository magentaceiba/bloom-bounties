import { WorkflowQuery } from '@/hooks'
import { VerifyArgs } from './types/claim'
import { waitUntilConfirmation } from './utils'
import { AddToast } from '@/hooks/useToastHandler'

export async function handleVerify({
  data: { claimId, contributors },
  workflow,
  addToast,
}: {
  data: VerifyArgs
  workflow: WorkflowQuery
  addToast: AddToast
}) {
  const { logicModule } = workflow.data!

  const parsedContributors = contributors.map(({ addr, claimAmount }) => ({
    addr,
    claimAmount,
  }))

  const config = [claimId, parsedContributors] as const

  const hash = await logicModule.write.verifyClaim.run(config)

  addToast({
    text: `Waiting for verify confirmation`,
    status: 'success',
  })

  await waitUntilConfirmation(workflow.publicClient, hash)

  return hash
}
