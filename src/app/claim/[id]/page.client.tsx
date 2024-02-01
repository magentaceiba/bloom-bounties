'use client'

import { FourOFour, WalletWidget } from '@/components'
import { BountyDetails } from '@/components/BountyDetails'
import { ContributerInput, Contributers } from '@/components/ContributerInput'
import useClaim from '@/hooks/useClaim'
import { useWorkflow } from '@/hooks/useWorkflow'
import { useState } from 'react'
import { Button, Loading } from 'react-daisyui'
import { FormattedBounty } from '@/lib/types/bounty'

export function ClientClaimPage({
  claim,
  isPending,
}: {
  claim: FormattedBounty
  isPending: boolean
}) {
  const workflow = useWorkflow()

  const bounty = claim

  const [contributers, setContributers] = useState<Contributers>([
    // @ts-ignore
    { uid: crypto.randomUUID(), addr: '', claimAmount: '' },
  ])

  const [url, setUrl] = useState('')

  const { post } = useClaim()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post.mutate({
      contributers: contributers.map((i) => ({
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

  if (isPending) return <Loading />

  if (!bounty) return <FourOFour />

  return (
    <>
      <BountyDetails.Main
        bigTitle
        title={bounty.details?.title}
        minimumPayoutAmount={bounty.minimumPayoutAmount}
        maximumPayoutAmount={bounty.maximumPayoutAmount}
        symbol={bounty.symbol}
        creatorAddress={bounty.details?.creatorAddress}
      />
      <BountyDetails.Description
        description={bounty?.details?.description}
        url={bounty?.details?.url}
      />

      {!workflow.isConnected ? (
        <WalletWidget />
      ) : (
        <form
          onSubmit={onSubmit}
          className="form-control gap-6 w-full max-w-xl"
        >
          <ContributerInput
            contributers={contributers}
            contributersStateHandler={setContributers}
            url={url}
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
      )}
    </>
  )
}
