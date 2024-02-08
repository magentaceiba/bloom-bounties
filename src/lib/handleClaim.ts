import { WorkflowQuery } from '@/hooks'
import { parseUnits, stringToHex } from 'viem'
import { ClaimArgs } from './types/claim'
import { waitUntilConfirmation } from './utils'

export async function handleClaim({
  data: { contributors, bountyId, details },
  workflow,
}: {
  data: ClaimArgs
  workflow: WorkflowQuery
}) {
  const { logic } = workflow.data!.contracts
  const { ERC20Symbol, ERC20Decimals } = workflow.data!

  const mappedContributers = contributors.map((c) => ({
    ...c,
    claimAmount: parseUnits(c.claimAmount, ERC20Decimals),
  }))

  const parsedDetails = stringToHex(JSON.stringify(details))

  const claim = await logic.write.addClaim([
    BigInt(bountyId),
    mappedContributers,
    parsedDetails,
  ])

  await waitUntilConfirmation(workflow.publicClient, claim)

  return {
    bountyId,
    claim,
    ERC20Symbol,
  }
}
