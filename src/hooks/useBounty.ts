import { useMutation } from '@tanstack/react-query'
import { useRevalidateServerPaths, useToast, useWorkflow } from '.'
import { BountyPostArgs, handleBountyPost } from '@/lib/handleBountyPost'

export function useBounty() {
  const workflow = useWorkflow()
  const { addToast } = useToast()
  const revalidateServerPaths = useRevalidateServerPaths()

  const post = useMutation({
    mutationKey: ['postBounty'],
    mutationFn: (data: BountyPostArgs) => handleBountyPost({ data, workflow }),

    onSuccess: (res) => {
      addToast({ text: `Bounty Posted: ${res}`, status: 'success' })
      revalidateServerPaths(['/'])
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
