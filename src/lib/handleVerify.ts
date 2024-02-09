import { WorkflowQuery } from '@/hooks'
import { VerifyArgs } from './types/claim'
import { parseUnits } from 'viem'
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
  const { logic } = workflow.data!.contracts
  const { ERC20Decimals } = workflow.data!

  const parsedContributors = contributors.map(({ addr, claimAmount }) => ({
    addr,
    claimAmount: parseUnits(claimAmount, ERC20Decimals),
  }))

  const config = [BigInt(claimId), parsedContributors] as const

  const hash = await logic.write.verifyClaim(config)

  addToast({
    text: `Waiting for verify confirmation`,
    status: 'success',
  })

  await waitUntilConfirmation(workflow.publicClient, hash)

  return hash
}
