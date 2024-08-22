import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useWorkflow } from '.'
import { useBalance } from 'wagmi'
import { toast } from 'sonner'

export function useFunding() {
  const [amount, setAmount] = useState('')
  const queryClient = useQueryClient()
  const workflow = useWorkflow()
  const address = workflow.address

  const onError = (err: any) => {
    toast.error(err?.message)
  }

  const refetchTotalSupply = () => {
    queryClient.refetchQueries({
      queryKey: ['totalSupply'],
    })
  }

  // Balance and allowance queries
  const balance = useBalance({
    address,
    token: workflow.data?.fundingToken.address,
  })

  const fundingManagerAddress = workflow.data?.fundingManager.address

  const allowance = useQuery({
    queryKey: ['allowance', address, fundingManagerAddress],
    queryFn: async () => {
      const allowanceValue =
        await workflow.data?.fundingToken.module.read.allowance.run([
          address!,
          fundingManagerAddress!,
        ])

      return allowanceValue!
    },
    enabled: workflow.isSuccess && !!address,
  })

  // Withdrawable funds query
  // const withdrawable = useQuery({
  //   queryKey: ['balanceInFunding', workflow.dataUpdatedAt],
  //   queryFn: async () => {
  //     const formatted =
  //       await workflow.data!.fundingToken.module.read.balanceOf.run(
  //         workflow.data?.fundingManager.address!
  //       )

  //     return formatted
  //   },
  //   enabled: workflow.isSuccess && !!workflow.address,
  // })

  // Deposit mutation
  const deposit = useMutation({
    mutationKey: ['deposit'],
    mutationFn: async (formatted: string) => {
      const hash =
        await workflow.data?.fundingManager.write?.deposit.run(formatted)!

      toast.info(`Waiting for deposit confirmation`)

      await workflow.publicClient?.waitForTransactionReceipt({ hash })

      return hash
    },

    onSuccess: () => {
      toast.success(`Deposit confirmed`)

      refetchTotalSupply()
      balance.refetch()
      allowance.refetch()
      // withdrawable.refetch()
      setAmount('')
    },
    onError,
  })

  // Withdraw mutation
  // const withdraw = useMutation({
  //   mutationKey: ['withdraw'],
  //   mutationFn: async (formattedAmount: string) => {
  //     if (!withdrawable.data) throw new Error('No withdrawable balance found')

  //     const hash =
  //       await workflow.data?.fundingManager.write?.deposit.run(formattedAmount)!

  //     toast.info(`Waiting for withdrawal confirmation`)

  //     await workflow.publicClient?.waitForTransactionReceipt({ hash })

  //     return hash
  //   },

  //   onSuccess: () => {
  //     withdrawable.refetch()
  //     refetchTotalSupply()
  //     balance.refetch()
  //     toast.success(`Withdrawal confirmed`)
  //   },

  //   onError,
  // })

  // Approval mutation for deposit
  const approve = useMutation({
    mutationKey: ['approve'],
    mutationFn: async (formattedAmount: string) => {
      const hash = await workflow.data?.fundingToken.module.write?.approve.run([
        fundingManagerAddress!,
        formattedAmount,
      ])!

      toast.info(`Waiting for approval confirmation`)

      await workflow.publicClient?.waitForTransactionReceipt({ hash })

      return { hash, formattedAmount }
    },

    onSuccess: ({ formattedAmount }) => {
      toast.success(`Approval confirmed`)
      allowance.refetch()
      deposit.mutate(formattedAmount)
    },

    onError,
  })

  // Handle deposit and withdraw actions
  const allowanceIsEnough = Number(amount) <= Number(allowance.data!),
    handleDeposit = () => {
      if (allowanceIsEnough) deposit.mutate(amount)
      else approve.mutate(amount)
    }
  // ,handleWithdraw = () => withdraw.mutate(amount)

  // Loading and enabled states
  const loading = deposit.isPending || allowance.isPending || approve.isPending
  // || withdraw.isPending ||
  // withdrawable.isPending,
  const isConnected = workflow.isConnected,
    isDepositable =
      allowance.isSuccess &&
      balance.isSuccess &&
      Number(amount) <= Number(balance.data?.formatted!)
  // ,isWithdrawable =
  // withdrawable.isSuccess && Number(withdrawable.data) >= Number(amount)

  return {
    ERC20Symbol: workflow.data?.fundingToken.symbol,
    balance: balance.data?.formatted,
    // withdrawable: withdrawable.data,
    allowance,
    isConnected,
    setAmount,
    loading,
    handleDeposit,
    // handleWithdraw,
    amount,
    isDepositable,
    // isWithdrawable,
  }
}
