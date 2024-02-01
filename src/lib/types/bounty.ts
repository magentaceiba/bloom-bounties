export type FormattedBountyDetails = {
  title?: string
  description?: string
  creatorAddress?: `0x${string}`
  url?: string
  date: string
}

export type FormattedBounty = {
  id: string
  details: FormattedBountyDetails
  minimumPayoutAmount: string
  maximumPayoutAmount: string
  symbol: string
  locked: boolean
}
