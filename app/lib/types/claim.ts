export type FormattedClaimDetails = {
  url: string
  date: string
}

export type ClaimObject =
  | {
      details: FormattedClaimDetails
      contributors: {
        addr: `0x${string}`
        claimAmount: string
        include: boolean
      }[]
      symbol: string
      bountyId: bigint
      claimed: boolean
    }
  | undefined
