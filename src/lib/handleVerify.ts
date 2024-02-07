import { WorkflowQuery } from '@/hooks'
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

  const parsedContributors = contributors.map(({ addr, claimAmount }) => ({
    addr,
    claimAmount: parseUnits(claimAmount, ERC20Decimals),
  }))

  const config = [BigInt(claimId), parsedContributors] as const

  const verify = await logic.write.verifyClaim(config)

  await waitUntilConfirmation(workflow.publicClient, verify)

  return { verify, ERC20Symbol }
}
