import { useToast } from '@/providers'
import { formatUnits, parseUnits } from 'viem'
import { useAccount, useBalance } from 'wagmi'
import { useWorkflowConfig } from './useWorkflowConfig'
import { useMutation, useQuery } from '@tanstack/react-query'

export default function useDeposit() {
  const addToast = useToast()
  const workflow = useWorkflowConfig()
  const { address } = useAccount()

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
      return res
    },
    onSuccess: () => {
      balance.refetch()
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
      deposit.mutate(formatted)
      return res
    },
    onSuccess: () => {
      allowance.refetch()
    },
    onError: (err) => {
      addToast({ text: err?.message, status: 'error' })
    },
  })

  const depositEnabled = (amount: string) => {
    return Number(amount) < Number(allowance.data?.formatted!)
  }

  return {
    ERC20Symbol: workflow.data?.ERC20Symbol,
    balance,
    allowance,
    deposit,
    approve,
    depositEnabled,
  }
}
