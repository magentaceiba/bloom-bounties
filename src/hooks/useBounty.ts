import { useMutation } from '@tanstack/react-query'
import { useWorkflow } from './useWorkflow'
import { useServerAction, useToast } from '.'
import { BountyPostArgs, handleBountyPost } from '@/lib/handleBountyPost'
import { revalidateServerPath } from '@/lib/actions/utils'

export function useBounty() {
  const workflow = useWorkflow()
  const { addToast } = useToast()
  const serverAction = useServerAction()

  const post = useMutation({
    mutationKey: ['postBounty'],
    mutationFn: (data: BountyPostArgs) => handleBountyPost({ data, workflow }),

    onSuccess: (res) => {
      addToast({ text: `Bounty Posted: ${res}`, status: 'success' })
      serverAction(() => revalidateServerPath('client', '/'))
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
