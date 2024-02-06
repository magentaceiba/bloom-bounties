import { useMutation } from '@tanstack/react-query'
import { useServerAction, useToast, useWorkflow } from '.'
import { BountyPostArgs, handleBountyPost } from '@/lib/handleBountyPost'
import { revalidateServerPaths } from '@/lib/actions/utils'

export function useBounty() {
  const workflow = useWorkflow()
  const { addToast } = useToast()
  const serverAction = useServerAction()

  const post = useMutation({
    mutationKey: ['postBounty'],
    mutationFn: (data: BountyPostArgs) => handleBountyPost({ data, workflow }),

    onSuccess: (res) => {
      addToast({ text: `Bounty Posted: ${res}`, status: 'success' })
      serverAction(() => revalidateServerPaths('client', ['/']))
    },

    onError: (err: any) => {
      addToast({ text: err?.message, status: 'error' })
    },
  })

  return {
    post,
    isConnected: workflow.isConnected,
    ERC20Symbol: workflow.data?.ERC20Symbol,
    address: workflow?.address,
  }
}
