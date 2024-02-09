import { WorkflowQuery } from '@/hooks'
import { parseUnits, stringToHex } from 'viem'
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
  const { logic } = workflow.data!.contracts
  const { ERC20Decimals } = workflow.data!

  const mappedContributers = contributors.map((c) => ({
    ...c,
    claimAmount: parseUnits(c.claimAmount, ERC20Decimals),
  }))

  const parsedDetails = stringToHex(JSON.stringify(details))

  const hash = await logic.write.addClaim([
    BigInt(bountyId),
    mappedContributers,
    parsedDetails,
  ])

  addToast({
    text: `Waiting for claim proposal confirmation`,
    status: 'success',
  })

  await waitUntilConfirmation(workflow.publicClient, hash)

  return hash
}
