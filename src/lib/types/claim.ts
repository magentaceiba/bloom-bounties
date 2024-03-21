export type FormattedClaimDetails = {
  url: string
  date: string
}

export type Contributor = {
  addr: `0x${string}`
  claimAmount: string
}

export type InitialContributor = {
  addr?: `0x${string}`
  claimAmount?: string
  uid: string
}

export type FormattedClaim = {
  claimId: string
  details: FormattedClaimDetails
  contributors: Contributor[]
  symbol: string
  bountyId: string
  claimed: boolean
}

export type ClaimArgs = {
  bountyId: string
  contributors: Contributor[]
  details: FormattedClaimDetails
}

export type EditContributersArgs = {
  claimId: string
  contributors: Contributor[]
}

export type VerifyArgs = {
  claimId: string
  contributors: Contributor[]
}
