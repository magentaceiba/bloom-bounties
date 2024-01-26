'use client'

import { FourOFour, WalletWidget } from '@/components'
import { BountyDetails } from '@/components/BountyDetails'
import { ContributerInput, Contributers } from '@/components/ContributerInput'
import { handleBountyList } from '@/lib/handleBountyList'
import useClaim from '@/hooks/useClaim'
import { useWorkflow } from '@/hooks/useWorkflow'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Button, Loading } from 'react-daisyui'

export function ClientClaimPage({ id }: { id: string }) {
  const workflow = useWorkflow()

  const bountyQuery = useQuery({
    queryKey: ['claimBounty', workflow.dataUpdatedAt],
    queryFn: async () =>
      (await handleBountyList(workflow.data!, [BigInt(id)]))[0],
    enabled: workflow.isSuccess,
  })

  const bounty = bountyQuery.data

  const [contributers, setContributers] = useState<Contributers>([
    { uid: crypto.randomUUID(), addr: workflow.address, claimAmount: '' },
  ])

  const [url, setUrl] = useState('')

  const { post } = useClaim()

  if (bountyQuery.isPending) return <Loading />

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
        <>
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
            onClick={() => {
              post.mutate({
                contributers: contributers.map((i) => ({
                  addr: i.addr!,
                  claimAmount: i.claimAmount!,
                })),
                details: {
                  url,
                  date: new Date().toISOString(),
                },
                bountyId: id,
              })
            }}
          >
            Submit
          </Button>
        </>
      )}
    </>
  )
}
