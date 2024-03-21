import { useMutation } from '@tanstack/react-query'
import { useRefreshServerPaths, useToast, useWorkflow } from '.'
import { BountyPostArgs, handleBountyPost } from '@/lib/handleBountyPost'

export function useBounty() {
  const workflow = useWorkflow()
  const { addToast } = useToast()
  const refreshServerPaths = useRefreshServerPaths()

  const post = useMutation({
    mutationKey: ['postBounty'],
    mutationFn: (data: BountyPostArgs) =>
      handleBountyPost({ data, workflow, addToast }),

    onSuccess: () => {
      addToast({ text: `Bounty post has been confirmed`, status: 'success' })
      refreshServerPaths.post(['bounties'])
    },

    onError: (err: any) => {
      addToast({ text: err?.message, status: 'error' })
    },
  })

  return {
    post,
    isConnected: workflow.isConnected,
    ERC20Symbol: workflow.data?.erc20Symbol,
    address: workflow?.address,
  }
}
