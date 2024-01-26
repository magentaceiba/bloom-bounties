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

export type ClaimArgs = {
  bountyId: string
  contributers: {
    addr: `0x${string}`
    claimAmount: string
  }[]
  details: FormattedClaimDetails
}

export type VerifyContributers = {
  addr: `0x${string}`
  claimAmount?: string
  include?: boolean
}[]

export type VerifyArgs = { claimId: string; contributors: VerifyContributers }
