import { useMutation, useQuery } from '@tanstack/react-query'
import { useWorkflow } from './useWorkflow'
import { useToast } from '@/providers'
import { BountyPostArgs, handleBountyPost } from '@/lib/handleBountyPost'
import { handleBountyList } from '@/lib/handleBountyList'

export function useBounty() {
  const workflow = useWorkflow()
  const addToast = useToast()

  const ids = useQuery({
    queryKey: ['bondtyIds', workflow.dataUpdatedAt],
    queryFn: () => workflow.data!.contracts.logic.read.listBountyIds(),
    enabled: workflow.isSuccess,
    refetchOnWindowFocus: false,
  })

  const list = useQuery({
    queryKey: ['bountyList', ids.dataUpdatedAt],
    queryFn: () => handleBountyList(workflow.data!, ids.data!),
    enabled: ids.isSuccess,
    refetchOnWindowFocus: false,
  })

  const post = useMutation({
    mutationKey: ['postBounty'],
    mutationFn: (data: BountyPostArgs) => handleBountyPost({ data, workflow }),

    onSuccess: (res) => {
      addToast({ text: `Bounty Posted: ${res}`, status: 'success' })
      list.refetch()
    },

    onError: (err: any) => {
      addToast({ text: err?.message, status: 'error' })
    },
  })

  return {
    list,
    post,
    isConnected: workflow.isConnected,
    ERC20Symbol: workflow.data?.ERC20Symbol,
    address: workflow.address,
  }
}
