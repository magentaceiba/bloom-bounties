import { compressAddress } from '@/lib/utils'
import { Frame } from '@/components'
import { Divider, Badge } from 'react-daisyui'

export const BountyDetails = {
  Main: ({
    title = '...',
    minimumPayoutAmount,
    maximumPayoutAmount,
    symbol,
    creatorAddress,
    bigTitle = false,
  }: {
    title?: string
    minimumPayoutAmount: string
    maximumPayoutAmount: string
    symbol: string
    creatorAddress?: string
    bigTitle?: boolean
  }) => (
    <div className="items-center justify-center p-3">
      {bigTitle ? <h3>{title}</h3> : <p>{title}</p>}

      <Divider />

      <div className="flex flex-wrap gap-3">
        <Badge>
          Min Payout | {minimumPayoutAmount} {symbol}
        </Badge>
        <Badge>
          Max Payout | {maximumPayoutAmount} {symbol}
        </Badge>
        <Badge>Creator | {compressAddress(creatorAddress)}</Badge>
      </div>
    </div>
  ),
  Description: ({
    description = '...',
    url = '/',
  }: {
    description?: string
    url?: string
  }) => (
    <Frame className="max-w-xl">
      <h4>Description</h4>
      <p>{description}</p>
      <h4>URL</h4>
      <a href={url} target="_blank" className="link">
        {url}
      </a>
    </Frame>
  ),
}
