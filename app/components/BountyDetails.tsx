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
  }: {
    title?: string
    minimumPayoutAmount: string
    maximumPayoutAmount: string
    symbol: string
    creatorAddress?: string
  }) => (
    <div className="items-center justify-center p-3">
      <div className="flex gap-3">
        <h4>Title |</h4>
        <p>{title}</p>
      </div>

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
