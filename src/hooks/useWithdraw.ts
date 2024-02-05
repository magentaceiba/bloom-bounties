import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useToast, useWorkflow } from '.'
import { formatUnits, parseUnits } from 'viem'
import { waitUntilConfirmation } from '@/lib/utils'
import { useState } from 'react'

export function useWithdraw() {
  const [amount, setAmount] = useState('')
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const workflow = useWorkflow()

  const withdrawable = useQuery({
    queryKey: ['balanceInFunding', workflow.dataUpdatedAt],
    queryFn: async () => {
      const parsed = await workflow.data?.contracts.funding.read.balanceOf([
        workflow.address!,
      ])!

      const data = {
        value: parsed,
        formatted: formatUnits(parsed, workflow.data!.ERC20Decimals),
      }

      return data
    },
    enabled: workflow.isSuccess && !!workflow.address,
  })

  const withdraw = useMutation({
    mutationKey: ['withdraw'],
    mutationFn: async (formatted: string) => {
      if (!withdrawable.data) throw new Error('No withdrawable balance found')

      const res = await workflow.data?.contracts.funding.write.withdraw([
        parseUnits(formatted, workflow.data!.ERC20Decimals),
      ])

      addToast({
        text: `Waiting for withdraw confirmation for ${formatted} ${workflow.data?.ERC20Symbol}`,
        status: 'info',
      })

      await waitUntilConfirmation(workflow.publicClient, res)

      return { res, formatted }
    },

    onSuccess: ({ formatted }) => {
      withdrawable.refetch()
      queryClient.refetchQueries({ queryKey: ['totalSupply'] })
      addToast({
        text: `Withdrawn ${formatted} ${workflow.data?.ERC20Symbol}`,
        status: 'success',
      })
    },

    onError: (error: any) => {
      addToast({
        text: error?.message,
        status: 'error',
      })
    },
  })

  const loading = withdraw.isPending || withdrawable.isPending
  const handleWithdraw = () => withdraw.mutate(amount)

  const isWithdrawable =
    withdrawable.isSuccess &&
    Number(withdrawable.data?.formatted) >= Number(amount)

  return {
    withdrawable,
    withdraw,
    loading,
    amount,
    setAmount,
    handleWithdraw,
    isWithdrawable,
  }
}
