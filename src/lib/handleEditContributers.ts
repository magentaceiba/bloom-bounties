import { WorkflowQuery } from '@/hooks'
import { EditContributersArgs } from './types/claim'
import { toast } from 'sonner'

export async function handleEditContributers({
  data: { claimId, contributors },
  workflow,
}: {
  data: EditContributersArgs
  workflow: WorkflowQuery
}) {
  const parsedContributors = contributors.map((c) => c)

  if (parsedContributors.length === 0) {
    throw new Error('No Contributors Included')
  }

  const hash =
    await workflow.data!.optionalModule.LM_PC_Bounties_v1.write.updateClaimContributors.run(
      [claimId, parsedContributors]
    )

  toast.info(`Waiting for edit contibutors confirmation`)

  await workflow.publicClient?.waitForTransactionReceipt({ hash })

  return hash
}
