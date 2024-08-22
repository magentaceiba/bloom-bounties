'use client'

import { useState } from 'react'
import { Button, Divider, Loading } from 'react-daisyui'
import { WalletWidget } from '@/components'
import { FundingStats } from '@/components/FundingStats'
import useClaim from '@/hooks/useClaim'
import { FormattedClaim } from '@/lib/types/claim'
import { useRole } from '@/hooks'
import { NoAccess, InteractiveTable, Frame, Copy } from '@/components/ui/'

export default function VerifyPageClient({ list }: { list: FormattedClaim[] }) {
  const { roles } = useRole()
  const { isConnected, ERC20Symbol, verify } = useClaim()
  const [selected, setSelected] = useState<number>(0)

  const claim = list[selected ?? 0]
  const contributors = claim?.contributors ?? []

  const onVerify = () => {
    if (!contributors) return

    verify.mutate({ claimId: claim.claimId, contributors })
  }

  if (!isConnected) return <WalletWidget />

  if (roles.isPending) return <Loading />

  if (!roles.data?.isVerifier) return <NoAccess />

  return (
    <>
      <FundingStats />

      <InteractiveTable
        onSelect={setSelected}
        heads={['Bounty ID', 'Claimed', 'URL']}
        rows={list.map((i) => [
          { item: i.bountyId },
          { item: i.claimed ? 'Yes' : 'No' },
          { item: i.details.url, type: 'url' },
        ])}
        className="max-w-xl"
      />

      {(() => {
        if (!isConnected) return <WalletWidget />

        return (
          <>
            {contributors.map(({ addr, claimAmount }, index) => {
              return (
                <Frame key={index} className="max-w-xl">
                  <h3>Contributer Adress</h3>
                  <div className="flex items-center gap-3">
                    <p className="break-all">{addr}</p> <Copy data={addr} />
                  </div>
                  <Divider className="m-0" />
                  <h4>{ERC20Symbol + ' ' + claimAmount}</h4>
                </Frame>
              )
            })}

            <Button
              onClick={onVerify}
              disabled={!isConnected || !!claim?.claimed || verify.isPending}
              loading={verify.isPending}
              color="primary"
            >
              Verify Claim
            </Button>
          </>
        )
      })()}
    </>
  )
}
