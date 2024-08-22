import { useRefreshServerPaths, useWorkflow } from '.'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ClaimArgs, EditContributersArgs, VerifyArgs } from '@/lib/types/claim'
import { handleClaim } from '@/lib/handleClaim'
import { handleVerify } from '@/lib/handleVerify'
import { handleClaimListForContributorAddress } from '@/lib/handleClaimList'
import { handleEditContributers } from '@/lib/handleEditContributers'
import { toast } from 'sonner'

export default function useClaim() {
  const workflow = useWorkflow()
  const refreshServerPaths = useRefreshServerPaths()

  const onError = (err: any) => {
    toast.error(err?.message)
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
    mutationFn: (data: ClaimArgs) => handleClaim({ data, workflow }),

    onSuccess: () => {
      contributorsList.refetch()
      refreshServerPaths.post(['verify'])

      toast.success(`Claim proposal has been confirmed`)
    },

    onError,
  })

  const verify = useMutation({
    mutationKey: ['performVerify'],
    mutationFn: (data: VerifyArgs) => handleVerify({ data, workflow }),

    onSuccess: () => {
      refreshServerPaths.post(['verify', 'claims'])

      toast.success(`Verify has been confirmed`)
    },

    onError,
  })

  const editContributors = useMutation({
    mutationKey: ['editContributors'],
    mutationFn: (data: EditContributersArgs) =>
      handleEditContributers({
        data,
        workflow,
      }),

    onSuccess: () => {
      toast.success(`Contributors edit has been confirmed`)
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
    ERC20Symbol: workflow.data?.fundingToken.symbol,
  }
}
