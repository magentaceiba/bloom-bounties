import { useMutation, useQuery } from '@tanstack/react-query'
import { useToast, useWorkflow } from '.'
import { useAccount } from 'wagmi'
import { RoleKeys, handleRoles } from '@/lib/handleRoles'
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
    mutationFn: async ({
      role,
      walletAddress,
      type,
    }: {
      role: RoleKeys
      walletAddress: Hex
      type: 'Grant' | 'Revoke'
    }) => {
      if (!roles.isSuccess) throw new Error('Roles not loaded')

      let action:
        | 'grantRole'
        | 'grantModuleRole'
        | 'revokeRole'
        | 'revokeModuleRole'

      switch (role) {
        case 'Owner':
          if (type === 'Grant') action = 'grantRole'
          else action = 'revokeRole'
          break
        default:
          if (type === 'Grant') action = 'grantModuleRole'
          else action = 'revokeModuleRole'
      }

      let hash: Hex

      if (action === 'grantRole' || action === 'revokeRole') {
        hash = await workflow.data!.contracts.authorizer.write[action]([
          roles.data!.roleIds[role],
          walletAddress,
        ])
      } else {
        hash = await workflow.data!.contracts.logic.write[action]([
          roles.data!.roleIds[role],
          walletAddress,
        ])
      }

      addToast({
        text: `Granting role ${role} to ${walletAddress}`,
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
