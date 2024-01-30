import { useServerAction, useToast } from './'
import { useWorkflow } from './useWorkflow'
import { useMutation } from '@tanstack/react-query'
import { ClaimArgs, VerifyArgs } from '@/lib/types/claim'
import { handleClaim } from '@/lib/handleClaim'
import { handleVerify } from '@/lib/handleVerify'
import { revalidateServerPath } from '@/lib/actions/utils'

export default function useClaim() {
  const workflow = useWorkflow()
  const { addToast } = useToast()
  const serverAction = useServerAction()

  const invlaidateBounties = () => {
    serverAction(() => revalidateServerPath('client', '/'))
  }

  const invalidateClaims = () => {
    serverAction(() => revalidateServerPath('client', '/verify'))
  }

  const post = useMutation({
    mutationKey: ['addClaim'],
    mutationFn: (data: ClaimArgs) => handleClaim({ data, workflow }),

    onSuccess: ({ bountyId, ERC20Symbol, claim }) => {
      invlaidateBounties()
      invalidateClaims()

      addToast({
        text: `Claim Proposal for ${String(
          bountyId
        )} ${ERC20Symbol} Has Been Submitted.\nWith TX Hash: ${claim}`,
        status: 'success',
      })
    },

    onError: (err) => {
      addToast({ text: err?.message, status: 'error' })
    },
  })

  const verify = useMutation({
    mutationKey: ['performVerify'],
    mutationFn: (data: VerifyArgs) => handleVerify({ data, workflow }),

    onSuccess: ({ ERC20Symbol, verify }) => {
      addToast({
        text: `Verify Proposal for ${1} ${ERC20Symbol} Has Been Submitted.\nWith TX Hash: ${verify}`,
        status: 'success',
      })

      invalidateClaims()
    },

    onError: (err) => {
      addToast({ text: err?.message, status: 'error' })
    },
  })

  return {
    post,
    verify,
    isConnected: workflow.isConnected,
    address: workflow.address,
    ERC20Symbol: workflow.data?.ERC20Symbol,
  }
}
