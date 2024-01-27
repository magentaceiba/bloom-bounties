import { useToast } from './'
import { useWorkflow } from './useWorkflow'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ClaimArgs, VerifyArgs } from '@/lib/types/claim'
import { handleClaim } from '@/lib/handleClaim'
import { handleClaimList } from '@/lib/handleClaimList'
import { handleVerify } from '@/lib/handleVerify'

export default function useClaim() {
  const workflow = useWorkflow()
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  const ids = useQuery({
    queryKey: ['claimIds', workflow.dataUpdatedAt],
    queryFn: () => workflow.data!.contracts.logic.read.listClaimIds(),
    enabled: workflow.isSuccess,
    refetchOnWindowFocus: false,
  })

  const list = useQuery({
    queryKey: ['claimList', ids.dataUpdatedAt],
    queryFn: () => handleClaimList(workflow.data!, ids.data!),
    enabled: ids.isSuccess,
    refetchOnWindowFocus: false,
  })

  const post = useMutation({
    mutationKey: ['addClaim'],
    mutationFn: (data: ClaimArgs) => handleClaim({ data, workflow }),

    onSuccess: ({ bountyId, ERC20Symbol, claim }) => {
      queryClient.invalidateQueries({
        queryKey: ['bondtyIds'],
      })

      list.refetch()

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

      ids.refetch()
    },

    onError: (err) => {
      addToast({ text: err?.message, status: 'error' })
    },
  })

  return {
    post,
    list,
    verify,
    isConnected: workflow.isConnected,
    address: workflow.address,
    ERC20Symbol: workflow.data?.ERC20Symbol,
  }
}
