import { useRefreshServerPaths, useToast, useWorkflow } from '.'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ClaimArgs, EditContributersArgs, VerifyArgs } from '@/lib/types/claim'
import { handleClaim } from '@/lib/handleClaim'
import { handleVerify } from '@/lib/handleVerify'
import { handleClaimListForContributorAddress } from '@/lib/handleClaimList'
import { handleEditContributers } from '@/lib/handleEditContributers'

export default function useClaim() {
  const workflow = useWorkflow()
  const { addToast } = useToast()
  const refreshServerPaths = useRefreshServerPaths()

  const onError = (err: any) => {
    addToast({ text: err?.message, status: 'error' })
  }

  const contributorsList = useQuery({
    queryKey: ['contributorsList'],
    queryFn: () =>
      handleClaimListForContributorAddress({
        workflow: workflow.data!,
        address: workflow.address!,
      }),
    enabled: !!workflow.address && workflow.isSuccess,
  })

  const post = useMutation({
    mutationKey: ['addClaim'],
    mutationFn: (data: ClaimArgs) => handleClaim({ data, workflow, addToast }),

    onSuccess: () => {
      contributorsList.refetch()
      refreshServerPaths.post(['verify'])

      addToast({
        text: `Claim proposal has been confirmed`,
        status: 'success',
      })
    },

    onError,
  })

  const verify = useMutation({
    mutationKey: ['performVerify'],
    mutationFn: (data: VerifyArgs) =>
      handleVerify({ data, workflow, addToast }),

    onSuccess: () => {
      refreshServerPaths.post(['verify', 'claims'])

      addToast({
        text: `Verify has been confirmed`,
        status: 'success',
      })
    },

    onError,
  })

  const editContributors = useMutation({
    mutationKey: ['editContributors'],
    mutationFn: (data: EditContributersArgs) =>
      handleEditContributers({
        data,
        workflow,
        addToast,
      }),

    onSuccess: () => {
      addToast({
        text: `Contributors edit has been confirmed`,
        status: 'success',
      })
      contributorsList.refetch()
      refreshServerPaths.post(['verify'])
    },

    onError,
  })

  return {
    editContributors,
    contributorsList,
    post,
    verify,
    isConnected: workflow.isConnected,
    address: workflow.address,
    ERC20Symbol: workflow.data?.ERC20Symbol,
  }
}
