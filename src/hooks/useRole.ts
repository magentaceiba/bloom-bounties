import { useMutation, useQuery } from '@tanstack/react-query'
import { useToast, useWorkflow } from '.'
import { useAccount } from 'wagmi'
import {
  RoleKeys,
  getHasRoles,
  grantOrRevokeRole,
  handleRoles,
} from '@/lib/handleRoles'
import { waitUntilConfirmation } from '@/lib/utils'
import { isAddress, type Hex } from 'viem'

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

  const checkRole = useMutation({
    mutationKey: ['checkRole'],
    mutationFn: (walletAddress: string) => {
      if (!roles.isSuccess) throw new Error('Roles query not success')
      if (!workflow.isSuccess) throw new Error('Workflow not success')
      if (!isAddress(walletAddress)) throw new Error('Invalid address')

      return getHasRoles({
        workflow: workflow.data,
        address: walletAddress,
        roleHexs: roles.data?.roleHexs!,
        generatedRoles: roles.data?.generatedRoles!,
      })
    },
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
        text: `${props.type}ng role ${props.role} to ${props.walletAddress}`,
        status: 'info',
      })

      await waitUntilConfirmation(workflow.publicClient!, hash)

      return { hash, address: props.walletAddress!, type: props.type }
    },

    onSuccess: ({ hash, address, type }) => {
      addToast({
        text: `Role ${type.toLowerCase}ed with hash ${hash}`,
        status: 'success',
      })
      roles.refetch()
      checkRole.mutate(address)
    },

    onError: (error) => {
      addToast({
        text: error.message,
        status: 'error',
      })
    },
  })

  return { roles, setRole, checkRole, isConnected: workflow.isConnected }
}
