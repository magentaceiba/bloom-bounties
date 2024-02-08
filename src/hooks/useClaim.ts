import { useRefreshServerPaths, useToast, useWorkflow } from '.'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ClaimArgs, EditContributersArgs, VerifyArgs } from '@/lib/types/claim'
import { handleClaim } from '@/lib/handleClaim'
import { handleVerify } from '@/lib/handleVerify'
import { handleClaimList } from '@/lib/handleClaimList'
import { handleEditContributers } from '@/lib/handleEditContributers'

export default function useClaim() {
  const workflow = useWorkflow()
  const { addToast } = useToast()
  const refreshServerPaths = useRefreshServerPaths()

  const post = useMutation({
    mutationKey: ['addClaim'],
    mutationFn: (data: ClaimArgs) => handleClaim({ data, workflow }),

    onSuccess: ({ bountyId, ERC20Symbol, claim }) => {
      contributorsList.refetch()
      refreshServerPaths.post(['verify'])

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
      refreshServerPaths.post(['verify', 'claims'])

      addToast({
        text: `Verify Proposal for ${1} ${ERC20Symbol} Has Been Submitted.\nWith TX Hash: ${verify}`,
        status: 'success',
      })
    },

    onError: (err) => {
      addToast({ text: err?.message, status: 'error' })
    },
  })

  const contributorsList = useQuery({
    queryKey: ['contributorsList'],
    queryFn: async () => {
      const ids =
        await workflow.data!.contracts.logic.read.listClaimIdsForContributorAddress(
          [workflow.address!]
        )
      const list = await handleClaimList(workflow.data!, ids)
      return list
    },
    enabled: !!workflow.address && workflow.isSuccess,
  })

  const editContributors = useMutation({
    mutationKey: ['editContributors'],
    mutationFn: async (data: EditContributersArgs) => {
      const hash = await handleEditContributers({
        data,
        workflow,
        addToast,
      })

      return hash
    },

    onSuccess: () => {
      addToast({
        text: `Contributors List Has Been Updated`,
        status: 'success',
      })
      contributorsList.refetch()
      refreshServerPaths.post(['verify'])
    },

    onError: (err) => {
      addToast({ text: err?.message, status: 'error' })
    },
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
