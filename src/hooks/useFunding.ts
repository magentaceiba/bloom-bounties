import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast, useWorkflow } from '.'
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
    token: workflow.data?.erc20Module.address,
  })

  const fundingManagerAddress = workflow.data?.fundingManager.address

  const allowance = useQuery({
    queryKey: ['allowance', address, fundingManagerAddress],
    queryFn: async () => {
      const allowanceValue =
        await workflow.data?.erc20Module.read.allowance.run([
          address!,
          fundingManagerAddress!,
        ])
      return allowanceValue!
    },
    enabled: workflow.isSuccess && !!address,
  })

  // Withdrawable funds query
  const withdrawable = useQuery({
    queryKey: ['balanceInFunding', workflow.dataUpdatedAt],
    queryFn: async () => {
      const formatted = await workflow.data?.fundingManager.read.balanceOf.run(
        workflow.address!
      )!

      return formatted
    },
    enabled: workflow.isSuccess && !!workflow.address,
  })

  // Deposit mutation
  const deposit = useMutation({
    mutationKey: ['deposit'],
    mutationFn: async (formatted: string) => {
      const hash =
        await workflow.data?.fundingManager.write?.deposit.run(formatted)

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

      const hash =
        await workflow.data?.fundingManager.write?.withdraw.run(formattedAmount)

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
      console.log('Approving', formattedAmount!)

      const hash = await workflow.data?.erc20Module.write?.approve.run([
        fundingManagerAddress!,
        formattedAmount,
      ])

      console.log('Approve hash', hash)

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
  const allowanceIsEnough = Number(amount) <= Number(allowance.data!),
    handleDeposit = () => {
      console.log(
        'allowanceIsEnough',
        allowanceIsEnough,
        'Allowance',
        allowance.data,
        'Amount',
        amount,
        'Balance',
        balance.data?.formatted
      )
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
      withdrawable.isSuccess && Number(withdrawable.data) >= Number(amount)

  return {
    ERC20Symbol: workflow.data?.erc20Symbol,
    balance: balance.data?.formatted,
    withdrawable: withdrawable.data,
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
