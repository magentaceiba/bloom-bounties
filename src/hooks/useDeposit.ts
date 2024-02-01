import { useToast } from '.'
import { formatUnits, parseUnits } from 'viem'
import { useBalance } from 'wagmi'
import { useWorkflow } from './useWorkflow'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { waitUntilConfirmation } from '@/lib/utils'

export default function useDeposit() {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const workflow = useWorkflow()
  const address = workflow.address

  const balance = useBalance({
    address,
    token: workflow.data?.addresses.ERC20,
  })

  const fetchAllowance = async () => {
    const allowance = await workflow.data?.contracts.ERC20.read.allowance([
      address!,
      workflow.data?.addresses.funding!,
    ])
    return {
      value: allowance,
      formatted: formatUnits(allowance!, workflow.data!.ERC20Decimals),
    }
  }

  const allowance = useQuery({
    queryKey: ['allowance', address, workflow.data?.addresses.funding],
    queryFn: fetchAllowance,
    enabled: workflow.isSuccess && !!address,
  })

  const deposit = useMutation({
    mutationKey: ['deposit'],
    mutationFn: async (formatted: string) => {
      const res = await workflow.data?.contracts.funding.write.deposit([
        parseUnits(formatted, workflow.data!.ERC20Decimals),
      ])

      addToast({
        text: `Waiting for deposit confirmation`,
        status: 'info',
      })

      await waitUntilConfirmation(workflow.publicClient, res)

      return res
    },
    onSuccess: () => {
      addToast({
        text: `Deposited ${workflow.data?.ERC20Symbol}`,
        status: 'success',
      })
      queryClient.invalidateQueries({
        queryKey: ['totalSupply'],
        refetchType: 'all',
      })
      balance.refetch()
      allowance.refetch()
    },
    onError: (err) => {
      addToast({ text: err?.message, status: 'error' })
    },
  })

  const approve = useMutation({
    mutationKey: ['approve'],
    mutationFn: async (formatted: string) => {
      const res = await workflow.data?.contracts.ERC20.write.approve([
        workflow.data?.addresses.funding!,
        parseUnits(formatted, workflow.data!.ERC20Decimals),
      ])

      addToast({
        text: `Waiting for approval confirmation`,
        status: 'info',
      })

      await waitUntilConfirmation(workflow.publicClient, res)

      return { hash: res, formatted }
    },

    onSuccess: ({ formatted }) => {
      addToast({
        text: `Approved ${workflow.data?.ERC20Symbol}`,
        status: 'success',
      })
      allowance.refetch()
      deposit.mutate(formatted)
    },

    onError: (err) => {
      addToast({ text: err?.message, status: 'error' })
    },
  })

  const depositEnabled = (amount: string) => {
    return Number(amount) <= Number(allowance.data?.formatted!)
  }

  return {
    ERC20Symbol: workflow.data?.ERC20Symbol,
    balance,
    allowance,
    deposit,
    approve,
    depositEnabled,
    isConnected: workflow.isConnected,
  }
}
