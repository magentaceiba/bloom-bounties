import { useMutation } from '@tanstack/react-query'
import { useRefreshServerPaths, useWorkflow } from '.'
import { BountyPostArgs, handleBountyPost } from '@/lib/handleBountyPost'
import { toast } from 'sonner'

export function useBounty() {
  const workflow = useWorkflow()
  const refreshServerPaths = useRefreshServerPaths()

  const post = useMutation({
    mutationKey: ['postBounty'],
    mutationFn: (data: BountyPostArgs) =>
      handleBountyPost({ data, workflow, toast }),

    onSuccess: () => {
      toast.success(`Bounty post has been confirmed`)
      refreshServerPaths.post(['bounties'])
    },

    onError: (err: any) => {
      toast.error(err?.message)
    },
  })

  return {
    post,
    isConnected: workflow.isConnected,
    ERC20Symbol: workflow.data?.fundingToken.symbol,
    address: workflow?.address,
  }
}
