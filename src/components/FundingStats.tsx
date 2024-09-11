'use client'

import useFundingStats from '@/hooks/useFundingStats'
import utils from '@/lib/utils'
import { Stats } from 'react-daisyui'

export function FundingStats() {
  const { symbol, totalSupply } = useFundingStats()
  return (
    <Stats className="bg-base-200 scale-75">
      <Stats.Stat>
        <Stats.Stat.Item variant="title">Price Usd</Stats.Stat.Item>
        <Stats.Stat.Item variant="value">{'1.00 $'}</Stats.Stat.Item>
      </Stats.Stat>

      <Stats.Stat>
        <Stats.Stat.Item variant="title">
          {symbol} Total FLO Available Now
        </Stats.Stat.Item>
        <Stats.Stat.Item variant="value">
          {utils.format.toCompactNumber(Number(totalSupply) * 1)} $
        </Stats.Stat.Item>
      </Stats.Stat>
    </Stats>
  )
}
