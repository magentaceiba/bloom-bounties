import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast, useWorkflow } from '.'
import { formatUnits, parseUnits } from 'viem'
import { useBalance } from 'wagmi'
import { waitUntilConfirmation } from '@/lib/utils'

export function useFunding() {
  const [amount, setAmount] = useState('')
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const workflow = useWorkflow()
  const address = workflow.address

  const onError = (err: any) => {
    addToast({ text: err?.message, status: 'error' })
  }

  const refetchTotalSupply = () => {
    queryClient.refetchQueries({
      queryKey: ['totalSupply'],
    })
  }

  // Balance and allowance queries
  const balance = useBalance({
    address,
    token: workflow.data?.addresses.ERC20,
  })

  const allowance = useQuery({
    queryKey: ['allowance', address, workflow.data?.addresses.funding],
    queryFn: async () => {
      const allowanceValue =
        await workflow.data?.contracts.ERC20.read.allowance([
          address!,
          workflow.data?.addresses.funding!,
        ])
      return {
        value: allowanceValue,
        formatted: formatUnits(allowanceValue!, workflow.data!.ERC20Decimals),
      }
    },
    enabled: workflow.isSuccess && !!address,
  })

  // Withdrawable funds query
  const withdrawable = useQuery({
    queryKey: ['balanceInFunding', workflow.dataUpdatedAt],
    queryFn: async () => {
      const parsed = await workflow.data?.contracts.funding.read.balanceOf([
        workflow.address!,
      ])!

      return {
        value: parsed,
        formatted: formatUnits(parsed, workflow.data!.ERC20Decimals),
      }
    },
    enabled: workflow.isSuccess && !!workflow.address,
  })

  // Deposit mutation
  const deposit = useMutation({
    mutationKey: ['deposit'],
    mutationFn: async (formatted: string) => {
      const hash = await workflow.data?.contracts.funding.write.deposit([
        parseUnits(formatted, workflow.data!.ERC20Decimals),
      ])

      addToast({
        text: `Waiting for deposit confirmation`,
        status: 'info',
      })

      await waitUntilConfirmation(workflow.publicClient, hash)

      return hash
    },

    onSuccess: () => {
      addToast({
        text: `Deposit confirmed`,
        status: 'success',
      })

      refetchTotalSupply()
      balance.refetch()
      allowance.refetch()
      withdrawable.refetch()
      setAmount('')
    },
    onError,
  })

  // Withdraw mutation
  const withdraw = useMutation({
    mutationKey: ['withdraw'],
    mutationFn: async (formattedAmount: string) => {
      if (!withdrawable.data) throw new Error('No withdrawable balance found')

      const hash = await workflow.data?.contracts.funding.write.withdraw([
        parseUnits(formattedAmount, workflow.data!.ERC20Decimals),
      ])

      addToast({
        text: `Waiting for withdrawal confirmation`,
        status: 'info',
      })

      await waitUntilConfirmation(workflow.publicClient, hash)

      return hash
    },

    onSuccess: () => {
      withdrawable.refetch()
      refetchTotalSupply()
      balance.refetch()
      addToast({
        text: `Withdrawal confirmed`,
        status: 'success',
      })
    },

    onError,
  })

  // Approval mutation for deposit
  const approve = useMutation({
    mutationKey: ['approve'],
    mutationFn: async (formattedAmount: string) => {
      const hash = await workflow.data?.contracts.ERC20.write.approve([
        workflow.data?.addresses.funding!,
        parseUnits(formattedAmount, workflow.data!.ERC20Decimals),
      ])

      addToast({
        text: `Waiting for approval confirmation`,
        status: 'info',
      })

      await waitUntilConfirmation(workflow.publicClient, hash)

      return { hash, formattedAmount }
    },

    onSuccess: ({ formattedAmount }) => {
      addToast({
        text: `Approval confirmed`,
        status: 'success',
      })
      allowance.refetch()
      deposit.mutate(formattedAmount)
    },

    onError,
  })

  // Handle deposit and withdraw actions
  const allowanceIsEnough =
      Number(amount) <= Number(allowance.data?.formatted!),
    handleDeposit = () => {
      if (allowanceIsEnough) deposit.mutate(amount)
      else approve.mutate(amount)
    },
    handleWithdraw = () => withdraw.mutate(amount)

  // Loading and enabled states
  const loading =
      deposit.isPending ||
      allowance.isPending ||
      approve.isPending ||
      withdraw.isPending ||
      withdrawable.isPending,
    isConnected = workflow.isConnected,
    isDepositable =
      allowance.isSuccess &&
      balance.isSuccess &&
      Number(amount) <= Number(balance.data?.formatted!),
    isWithdrawable =
      withdrawable.isSuccess &&
      Number(withdrawable.data?.formatted) >= Number(amount)

  return {
    ERC20Symbol: workflow.data?.ERC20Symbol,
    balance: balance.data?.formatted,
    withdrawable: withdrawable.data?.formatted,
    allowance,
    isConnected,
    setAmount,
    loading,
    handleDeposit,
    handleWithdraw,
    amount,
    isDepositable,
    isWithdrawable,
  }
}
