'use client'

import useFundingStats from '@/hooks/useFundingStats'
import { formatToCompactNumber } from '@/lib/utils'
import { Stats } from 'react-daisyui'

export function FundingStats() {
  const { symbol, totalSupply, isPending } = useFundingStats()
  return (
    <Stats className="bg-base-200 scale-75">
      <Stats.Stat>
        <Stats.Stat.Item variant="title">TVL</Stats.Stat.Item>
        <Stats.Stat.Item variant="value">
          {symbol} {formatToCompactNumber(totalSupply.formatted)}
        </Stats.Stat.Item>
      </Stats.Stat>

      <Stats.Stat>
        <Stats.Stat.Item variant="title">Price Usd</Stats.Stat.Item>
        <Stats.Stat.Item variant="value">{'1.00 $'}</Stats.Stat.Item>
      </Stats.Stat>

      <Stats.Stat>
        <Stats.Stat.Item variant="title">Usd Total</Stats.Stat.Item>
        <Stats.Stat.Item variant="value">
          {formatToCompactNumber(Number(totalSupply.formatted) * 1)} $
        </Stats.Stat.Item>
      </Stats.Stat>
    </Stats>
  )
}
