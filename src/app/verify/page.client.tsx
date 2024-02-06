'use client'

import { useState } from 'react'
import { Button, Loading } from 'react-daisyui'
import { WalletWidget } from '@/components'
import { FundingStats } from '@/components/FundingStats'
import useClaim from '@/hooks/useClaim'
import { VerifierInput } from '@/components/VerifierInput'
import { FormattedClaim, VerifyContributers } from '@/lib/types/claim'
import { useRole } from '@/hooks'
import { NoAccess, InteractiveTable } from '@/components/ui/'

export default function VerifyPageClient({
  list,
  isPending,
}: {
  list: FormattedClaim[]
  isPending: boolean
}) {
  const { roles } = useRole()
  const { isConnected, ERC20Symbol, verify } = useClaim()
  const [selected, setSelected] = useState<number>(0)

  const claim = list[selected ?? 0]

  const [contributors, setContributors] = useState<VerifyContributers>(
    claim?.contributors ?? []
  )

  const onVerify = () => {
    if (!claim) return

    verify.mutate({ claimId: String(claim.claimId), contributors })
  }

  if (!isConnected) return <WalletWidget />

  if (roles.isPending) return <Loading />

  if (!roles.data?.isVerifier) return <NoAccess />

  return (
    <>
      <FundingStats />

      <InteractiveTable
        isPending={isPending}
        heads={['Bounty ID', 'Claimed', 'URL']}
        rows={list.map((i) => ({
          row: [
            { item: String(i.bountyId) },
            { item: i.claimed ? 'Yes' : 'No' },
            { item: i.details.url, type: 'url' },
          ],
        }))}
        className="py-10 max-w-xl"
      />

      {!isConnected ? (
        <WalletWidget />
      ) : (
        <>
          <VerifierInput
            claim={claim}
            contributers={contributors}
            contributersStateHandler={setContributors}
            symbol={ERC20Symbol}
          />
          <Button
            onClick={onVerify}
            disabled={!isConnected || !!claim?.claimed || verify.isPending}
            loading={verify.isPending}
            color="primary"
          >
            Verify Claim
          </Button>
        </>
      )}
    </>
  )
}
