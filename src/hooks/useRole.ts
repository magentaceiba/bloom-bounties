import { useQuery } from '@tanstack/react-query'
import { useWorkflow } from '.'
import { useAccount } from 'wagmi'
import { handleRoles } from '@/lib/handleRoles'

export function useRole() {
  const { address } = useAccount()
  const workflow = useWorkflow()

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

  return roles
}
