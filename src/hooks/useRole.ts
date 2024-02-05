import { useMutation, useQuery } from '@tanstack/react-query'
import { useToast, useWorkflow } from '.'
import { useAccount } from 'wagmi'
import { RoleKeys, grantOrRevokeRole, handleRoles } from '@/lib/handleRoles'
import { waitUntilConfirmation } from '@/lib/utils'
import { type Hex } from 'viem'

export function useRole() {
  const { address } = useAccount()
  const workflow = useWorkflow()
  const { addToast } = useToast()

  const roles = useQuery({
    queryKey: ['roles', workflow.dataUpdatedAt],
    queryFn: () =>
      handleRoles({
        workflow: workflow.data!,
        address: address!,
      }),

    enabled: workflow.isSuccess && !!address,
    refetchOnWindowFocus: false,
  })

  const setRole = useMutation({
    mutationKey: ['grantRole'],
    mutationFn: async (props: {
      role: RoleKeys
      walletAddress: Hex
      type: 'Grant' | 'Revoke'
    }) => {
      const hash = await grantOrRevokeRole({
        ...props,
        workflow: workflow.data!,
        roleHexs: roles.data!.roleHexs,
      })

      addToast({
        text: `Granting role ${props.role} to ${props.walletAddress}`,
        status: 'info',
      })

      await waitUntilConfirmation(workflow.publicClient, hash)

      return hash
    },

    onSuccess: (hash) => {
      addToast({
        text: `Role granted with hash ${hash}`,
        status: 'success',
      })
      roles.refetch()
    },

    onError: (error) => {
      addToast({
        text: error.message,
        status: 'error',
      })
    },
  })

  return { roles, setRole, isConnected: !!address }
}
