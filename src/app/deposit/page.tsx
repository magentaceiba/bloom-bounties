'use client'

import { NumberInput, WalletWidget } from '@/components'
import { FundingStats } from '@/components/FundingStats'
import { useDeposit } from '@/hooks'
import { formatToCompactNumber } from '@/lib/utils'
import { useState } from 'react'
import { Alert, Button, Stats } from 'react-daisyui'

export default function DepositPage() {
  const {
    ERC20Symbol,
    handleDeposit,
    loading,
    balance,
    allowance,
    isConnected,
    setAmount,
    amount,
  } = useDeposit()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleDeposit()
  }

  const hasNoBalance = !balance.isSuccess || balance.data?.value === BigInt(0)

  return (
    <>
      <FundingStats />

      <Stats className="bg-base-200 scale-75">
        <Stats.Stat>
          <Stats.Stat.Item variant="title">Balance</Stats.Stat.Item>
          <Stats.Stat.Item variant="value">
            {ERC20Symbol} {formatToCompactNumber(balance.data?.formatted)}
          </Stats.Stat.Item>
        </Stats.Stat>

        <Stats.Stat>
          <Stats.Stat.Item variant="title">Allowance</Stats.Stat.Item>
          <Stats.Stat.Item variant="value">
            {formatToCompactNumber(allowance.data?.formatted)}
          </Stats.Stat.Item>
        </Stats.Stat>
      </Stats>

      <NumberInput
        label={'Deposit Amount'}
        onChange={setAmount}
        value={amount}
        required
      />

      <form onSubmit={onSubmit}>
        {!isConnected ? (
          <WalletWidget />
        ) : (
          <Button
            color="primary"
            type="submit"
            disabled={hasNoBalance || !allowance.isSuccess || loading}
            loading={loading}
          >
            Deposit
          </Button>
        )}
      </form>

      {hasNoBalance && (
        <Alert className="max-w-xl">
          You have no balance to deposit, please top up your account.
        </Alert>
      )}
    </>
  )
}
