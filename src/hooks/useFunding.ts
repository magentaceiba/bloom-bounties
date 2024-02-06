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

      const res = await workflow.data?.contracts.funding.write.withdraw([
        parseUnits(formattedAmount, workflow.data!.ERC20Decimals),
      ])

      addToast({
        text: `Waiting for withdraw confirmation for ${formattedAmount} ${workflow.data?.ERC20Symbol}`,
        status: 'info',
      })

      await waitUntilConfirmation(workflow.publicClient, res)

      return { res, formattedAmount }
    },
    onSuccess: ({ formattedAmount }) => {
      withdrawable.refetch()
      refetchTotalSupply()
      balance.refetch()
      addToast({
        text: `Withdrawn ${formattedAmount} ${workflow.data?.ERC20Symbol}`,
        status: 'success',
      })
    },
    onError,
  })

  // Approval mutation for deposit
  const approve = useMutation({
    mutationKey: ['approve'],
    mutationFn: async (formattedAmount: string) => {
      const res = await workflow.data?.contracts.ERC20.write.approve([
        workflow.data?.addresses.funding!,
        parseUnits(formattedAmount, workflow.data!.ERC20Decimals),
      ])

      addToast({
        text: `Waiting for approval confirmation`,
        status: 'info',
      })

      await waitUntilConfirmation(workflow.publicClient, res)

      return { hash: res, formattedAmount }
    },
    onSuccess: ({ formattedAmount }) => {
      addToast({
        text: `Approved ${formattedAmount} ${workflow.data?.ERC20Symbol}`,
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
