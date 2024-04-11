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

  // Roles query: fetches roles and roleHexs for the connected address
  // Enabled only when workflow and address are available
  // Roles query is used to check if the connected address has roles
  // and returns the necessary data to check if any other address has roles
  const roles = useQuery({
    queryKey: ['roles', address],
    queryFn: () =>
      handleRoles({
        workflow: workflow.data!,
        address: address!,
      }),

    enabled: workflow.isSuccess && !!address,
  })

  // Check role mutation: checks if any given address has roles
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

  // Set role mutation: grants or revokes a role to/from a given address
  const setRole = useMutation({
    mutationKey: ['grantRole'],
    mutationFn: async (props: {
      role: RoleKeys
      walletAddress: Hex
      type: 'Grant' | 'Revoke'
    }) => {
      // Handle the grant or revoke role / return the transaction hash
      const hash = await grantOrRevokeRole({
        ...props,
        workflow: workflow.data!,
        roleHexs: roles.data!.roleHexs,
      })

      // Add a toast to notify the user that the role is being set
      addToast({
        text: `${props.type}ng role ${props.role} to ${props.walletAddress}`,
        status: 'info',
      })

      // Wait for the transaction to be confirmed
      await waitUntilConfirmation(workflow.publicClient!, hash)

      // Return the transaction hash and the address and type of the role
      return { hash, address: props.walletAddress!, type: props.type }
    },

    onSuccess: ({ hash, address: anyAddress, type }) => {
      // Add a toast to notify the user that the role has been set
      addToast({
        text: `Role ${type.toLowerCase()}ed with hash ${hash}`,
        status: 'success',
      })
      // if the address is the connected address, refetch the roles
      if (address === anyAddress) roles.refetch()
      // run the checkRole mutation to notify the UI of the change
      checkRole.mutate(anyAddress)
    },

    onError: (error) => {
      // Add a toast to notify the user of the error
      addToast({
        text: error.message,
        status: 'error',
      })
    },
  })

  return { roles, setRole, checkRole, isConnected: workflow.isConnected }
}
