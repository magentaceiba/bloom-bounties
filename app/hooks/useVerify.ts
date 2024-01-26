import { useToast } from '@/providers'
import { parseUnits } from 'viem'
import type { workflowQuery } from './useWorkflow'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { VerifyContributers } from '@/components/VerifierInput'

export default function useVerify(workflow: workflowQuery) {
  const queryClient = useQueryClient()
  const addToast = useToast()

  const verify = useMutation({
    mutationKey: ['performVerify'],
    mutationFn: async ({
      claimId,
      contributors,
    }: {
      claimId: string
      contributors: VerifyContributers
    }) => {
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

      addToast({
        text: `Verify Proposal for ${1} ${ERC20Symbol} Has Been Submitted.\nWith TX Hash: ${verify}`,
        status: 'success',
      })
    },
    onError: (err) => {
      addToast({ text: err?.message, status: 'error' })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['verifyIds'],
      })
    },
  })

  return {
    ...verify,
    isConnected: workflow.isConnected,
  }
}
