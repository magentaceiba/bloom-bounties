'use client'

import { Frame, NumberInput } from '@/components'
import { FundingStats } from '@/components/FundingStats'
import { useDeposit } from '@/hooks'
import { formatToCompactNumber } from '@/lib/utils'
import { useState } from 'react'
import { Alert, Button, Stats } from 'react-daisyui'

export default function DepositPage() {
  const [amount, setAmount] = useState('')
  const { ERC20Symbol, depositEnabled, deposit, balance, approve, allowance } =
    useDeposit()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(depositEnabled(amount))
    if (depositEnabled(amount)) deposit.mutate(amount)
    else approve.mutate(amount)
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
      />

      <form onSubmit={onSubmit}>
        <Button
          color="primary"
          type="submit"
          disabled={hasNoBalance || !allowance.isSuccess}
          loading={deposit.isPending || allowance.isPending}
        >
          Deposit
        </Button>
      </form>

      {hasNoBalance && (
        <Alert>
          You have no balance to deposit, please top up your account.
        </Alert>
      )}
    </>
  )
}
