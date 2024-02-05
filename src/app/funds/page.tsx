'use client'

import { NumberInput, Tabs, WalletWidget } from '@/components'
import { FundingStats } from '@/components/FundingStats'
import { useDeposit } from '@/hooks'
import { useWithdraw } from '@/hooks/useWithdraw'
import { formatToCompactNumber } from '@/lib/utils'
import { useState } from 'react'
import { Button, Stats } from 'react-daisyui'

const tabs = ['Deposit', 'Withdraw'] as const

export default function FundsPage() {
  const [tab, setTab] = useState(0)
  const {
    ERC20Symbol,
    handleDeposit,
    loading: loadingDeposit,
    balance,
    allowance,
    isConnected,
    setAmount: setDepositAmount,
    isDepositable,
  } = useDeposit()

  const {
    withdrawable,
    loading: loadingWithdraw,
    setAmount: setWithdrawAmount,
    handleWithdraw,
    isWithdrawable,
  } = useWithdraw()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (tab === 0) handleDeposit()
    else handleWithdraw()
  }

  let loading: boolean
  const disabled = (() => {
    switch (tab) {
      case 0:
        loading = loadingDeposit
        return !isDepositable || loading
      case 1:
        loading = loadingWithdraw
        return loading || !isWithdrawable
    }
  })()

  return (
    <>
      <Tabs
        variant="boxed"
        setTab={setTab}
        tab={tab}
        tabs={tabs as unknown as string[]}
      />

      <FundingStats />

      <Stats className="bg-base-200 scale-75">
        <Stats.Stat>
          <Stats.Stat.Item variant="title">
            {tab === 0 ? 'Balance' : 'Deposited'}
          </Stats.Stat.Item>
          <Stats.Stat.Item variant="value">
            {ERC20Symbol}{' '}
            {formatToCompactNumber(
              tab === 0 ? balance.data?.formatted : withdrawable.data?.formatted
            )}
          </Stats.Stat.Item>
        </Stats.Stat>

        {tab !== 1 && (
          <Stats.Stat>
            <Stats.Stat.Item variant="title">Allowance</Stats.Stat.Item>
            <Stats.Stat.Item variant="value">
              {formatToCompactNumber(allowance.data?.formatted)}
            </Stats.Stat.Item>
          </Stats.Stat>
        )}
      </Stats>

      <NumberInput
        label={`${tabs[tab]} Amount`}
        onChange={tab === 0 ? setDepositAmount : setWithdrawAmount}
        max={tab === 0 ? balance.data?.formatted : withdrawable.data?.formatted}
        required
      />

      <form onSubmit={onSubmit}>
        {!isConnected ? (
          <WalletWidget />
        ) : (
          <Button
            color="primary"
            type="submit"
            disabled={disabled}
            loading={loading!}
          >
            {tab === 0 ? 'Deposit' : 'Withdraw'}
          </Button>
        )}
      </form>
    </>
  )
}
