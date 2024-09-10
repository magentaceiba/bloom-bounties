'use client'

import { FourOFour, NoAccess, WalletWidget } from '@/components'
import { BountyDetails } from '@/components/BountyDetails'
import { ContributerInput } from '@/components/ContributerInput'
import useClaim from '@/hooks/useClaim'
import { useRole, useWorkflow } from '@/hooks'
import { useState } from 'react'
import { Button, Loading } from 'react-daisyui'
import { FormattedBounty } from '@/lib/types/bounty'
import { InitialContributor } from '@/lib/types/claim'
import { toast } from 'sonner'

export function ClientClaimPage({ claim }: { claim: FormattedBounty }) {
  const workflow = useWorkflow()
  const { roles, isConnected } = useRole()

  const bounty = claim

  const [contributors, setContributers] = useState<InitialContributor[]>([
      { uid: crypto.randomUUID(), addr: '' as `0x${string}`, claimAmount: '' },
    ]),
    [url, setUrl] = useState('')

  const { post } = useClaim()

  const total = contributors.reduce((acc, i) => acc + Number(i.claimAmount), 0)

  const isTotalValid =
    total >= Number(bounty.minimumPayoutAmount) &&
    total <= Number(bounty.maximumPayoutAmount)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isTotalValid) {
      toast.warning(
        `Total amount should be between ${bounty.minimumPayoutAmount} and ${bounty.maximumPayoutAmount},\n it was ${total}`
      )

      return
    }

    post.mutate({
      contributors: contributors.map((i) => ({
        addr: i.addr!,
        claimAmount: i.claimAmount!,
      })),
      details: {
        url,
        date: new Date().toISOString(),
      },
      bountyId: claim.id,
    })
  }

  if (!isConnected) return <WalletWidget />

  if (roles.isPending) return <Loading />

  if (!bounty) return <FourOFour />

  if (!roles.data?.isClaimer) return <NoAccess />

  const minimumPayoutAmount = bounty.minimumPayoutAmount,
    maximumPayoutAmount = bounty.maximumPayoutAmount

  return (
    <>
      <BountyDetails.Main
        bigTitle
        title={bounty.details?.title}
        minimumPayoutAmount={minimumPayoutAmount}
        maximumPayoutAmount={maximumPayoutAmount}
        symbol={bounty.symbol}
        creatorAddress={bounty.details?.creatorAddress}
      />
      <BountyDetails.Description
        description={bounty?.details?.description}
        url={bounty?.details?.url}
      />

      {(() => {
        if (!workflow.isConnected) return <WalletWidget />

        return (
          <form
            onSubmit={onSubmit}
            className="form-control gap-6 w-full max-w-xl"
          >
            <ContributerInput
              maximumPayoutAmount={maximumPayoutAmount}
              contributors={contributors}
              contributersStateHandler={setContributers}
              onUrlChange={setUrl}
              symbol={workflow.data?.fundingToken.symbol}
            />
            <Button
              loading={post.isPending}
              disabled={post.isPending}
              color="primary"
              type="submit"
            >
              Submit
            </Button>
            <div className="text-sm italic font-light">
              You can add more participants to the claim when they join Bloom,
              up until the claim is verified at the end of the grant cycle.
            </div>
            <div className="mt-6 font-bold">
              What happens after I submit my bounty claim?
            </div>
            <div className="text-gray200">
              Once you submit your bounty claim, it will go to the verification
              team for review. If approved, you will receive Bloom tokens. Bloom
              tokens are a reputation token and not directly tradable for money
              - they signify your value contribution to our collective mission.
              As Bloom Network grows a grants pool, people who received Bloom
              tokens will periodically receive a payout from the grants pool,
              proportional to the amount of Bloom tokens they have. This is
              similar to a grocery cooperative member dividend. Final
              verification will not be done until after the round closes, so you
              can still add people who participated in this action until then,
              once they join Bloom Network.
            </div>
          </form>
        )
      })()}
    </>
  )
}
