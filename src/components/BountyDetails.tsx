import utils from '@/lib/utils'
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
        <Badge>Creator | {utils.format.compressAddress(creatorAddress)}</Badge>
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
      <h4>Regenerative Actions</h4>
      <p>{description}</p>
      <a
        href={url}
        target="_blank"
        className="link whitespace-normal break-all"
      >
        {url}
      </a>
    </Frame>
  ),
  DetailedDescription: ({
    description = '...',
    url = '/',
    minimumPayoutAmount,
    maximumPayoutAmount,
    symbol,
    creatorAddress,
  }: {
    description?: string
    url?: string
    minimumPayoutAmount: string
    maximumPayoutAmount: string
    symbol: string
    creatorAddress?: string
  }) => (
    <Frame className="max-w-xl">
      <h4>Regenerative Actions</h4>
      <p>{description}</p>
      <a
        href={url}
        target="_blank"
        className="link whitespace-normal break-all mb-4"
      >
        {url}
      </a>
      <div className="flex flex-wrap gap-3 justify-center">
        <Badge>
          Min Payout | {minimumPayoutAmount} {symbol}
        </Badge>
        <Badge>
          Max Payout | {maximumPayoutAmount} {symbol}
        </Badge>
        <Badge>Creator | {utils.format.compressAddress(creatorAddress)}</Badge>
      </div>
    </Frame>
  ),
}
