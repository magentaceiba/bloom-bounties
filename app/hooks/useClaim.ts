import { useToast } from '@/providers'
import { parseUnits, stringToHex } from 'viem'
import type { workflowQuery } from './useWorkflow'
import { useMutation } from '@tanstack/react-query'
import { FormattedClaimDetails } from '@/lib/types/claim'

export default function useClaim(workflow: workflowQuery) {
  const addToast = useToast()

  const claim = useMutation({
    mutationKey: ['addClaim'],
    mutationFn: async ({
      contributers,
      bountyId,
      details,
    }: {
      bountyId: string
      contributers: {
        addr: `0x${string}`
        claimAmount: string
      }[]
      details: FormattedClaimDetails
    }) => {
      const { logic } = workflow.data!.contracts
      const { ERC20Symbol, ERC20Decimals } = workflow.data!

      const mappedContributers = contributers.map((c) => ({
        ...c,
        claimAmount: parseUnits(c.claimAmount, ERC20Decimals),
      }))

      const parsedDetails = stringToHex(JSON.stringify(details))

      const claim = await logic.write.addClaim([
        BigInt(bountyId),
        mappedContributers,
        // Details
        parsedDetails,
      ])

      addToast({
        text: `Claim Proposal for ${1} ${ERC20Symbol} Has Been Submitted.\nWith TX Hash: ${claim}`,
        status: 'success',
      })
    },
    onError: (err) => {
      addToast({ text: err?.message, status: 'error' })
    },
  })

  return {
    ...claim,
    isConnected: workflow.isConnected,
  }
}
