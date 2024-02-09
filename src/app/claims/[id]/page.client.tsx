'use client'

import { FourOFour, NoAccess, WalletWidget } from '@/components'
import { BountyDetails } from '@/components/BountyDetails'
import { ContributerInput } from '@/components/ContributerInput'
import useClaim from '@/hooks/useClaim'
import { useRole, useToast, useWorkflow } from '@/hooks'
import { useState } from 'react'
import { Button, Loading } from 'react-daisyui'
import { FormattedBounty } from '@/lib/types/bounty'
import { InitialContributor } from '@/lib/types/claim'

export function ClientClaimPage({ claim }: { claim: FormattedBounty }) {
  const { addToast } = useToast()
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

    if (!isTotalValid)
      return addToast({
        text: `Total amount should be between ${bounty.minimumPayoutAmount} and ${bounty.maximumPayoutAmount},\n it was ${total}`,
        status: 'warning',
      })

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
              symbol={workflow.data?.ERC20Symbol}
            />
            <Button
              loading={post.isPending}
              disabled={post.isPending}
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </form>
        )
      })()}
    </>
  )
}
