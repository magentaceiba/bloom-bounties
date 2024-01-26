import { WorkflowQuery } from '@/hooks/useWorkflow'
import { VerifyArgs } from './types/claim'
import { parseUnits } from 'viem'
import { waitUntilConfirmation } from './utils'

export async function handleVerify({
  data: { claimId, contributors },
  workflow,
}: {
  data: VerifyArgs
  workflow: WorkflowQuery
}) {
  const { logic } = workflow.data!.contracts
  const { ERC20Symbol, ERC20Decimals } = workflow.data!

  const parsedContributors = contributors
    .map((c) => {
      if (c.include)
        return {
          addr: c.addr,
          claimAmount: parseUnits(c.claimAmount!, ERC20Decimals),
        }
    })
    .filter((c): c is NonNullable<typeof c> => c !== undefined)

  if (parsedContributors.length === 0) {
    throw new Error('No Contributors Included')
  }

  const config = [BigInt(claimId), parsedContributors] as const

  const verify = await logic.write.verifyClaim(config)

  await waitUntilConfirmation(workflow.publicClient, verify)

  return { verify, ERC20Symbol }
}
