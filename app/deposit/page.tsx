'use client'

import { Frame, NumberInput } from '@/components'
import { useDeposit } from '@/hooks'
import { useState } from 'react'
import { Alert, Button } from 'react-daisyui'

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
      <Frame className="flex-row">
        <div className="flex-col flex-1">
          <h3>Token: {ERC20Symbol}</h3>
          <h4>Balance: {balance.data?.formatted ?? '...'}</h4>
        </div>
        <div className="flex-col flex-1">
          <h3>Allowance</h3>
          <h4>Amount: {allowance.data?.formatted ?? '...'}</h4>
        </div>
      </Frame>

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
