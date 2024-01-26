'use client'

import { useEffect, useState } from 'react'
import { Button, Loading, Table } from 'react-daisyui'
import { NoData, WalletWidget } from '@/components'
import { FundingStats } from '@/components/FundingStats'
import { useClaimList } from '@/hooks/useClaimList'
import Link from 'next/link'
import cn from 'classnames'
import useVerify from '@/hooks/useVerify'
import { VerifierInput, VerifyContributers } from '@/components/VerifierInput'

export default function VerifyPage() {
  const list = useClaimList()
  const [selected, setSelected] = useState<number>(0)

  const claim = list.data?.[selected ?? 0]

  const verify = useVerify(list.workflow)

  const [contributors, setContributors] = useState<VerifyContributers>(
    claim?.contributors ?? []
  )

  useEffect(() => {
    if (!claim) return
    setContributors(claim.contributors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.dataUpdatedAt])

  const onVerify = () => {
    if (!claim) return

    verify.mutate({ claimId: String(claim.claimId), contributors })
  }

  return (
    <>
      <FundingStats />

      {(() => {
        if (list.isPending) return <Loading className={'m-4'} />

        if (!list.data?.length) return <NoData />

        return (
          <div className="overflow-y-scroll w-full max-w-4xl py-10 max-h-64">
            <Table>
              <Table.Head>
                <span>Bounty ID</span>
                <span>Claimed</span>
                <span>URL</span>
              </Table.Head>

              <Table.Body>
                {list.data.map((i, index) => (
                  <Table.Row
                    className={cn(
                      'cursor-pointer transition-transform duration-150 ease-in-out transform active:scale-95',
                      'hover:bg-primary hover:text-primary-content',
                      selected === index && 'bg-primary text-primary-content'
                    )}
                    key={index}
                    onClick={() => setSelected(index)}
                  >
                    <span>{String(i.bountyId)}</span>
                    <span>{i.claimed ? 'Yes' : 'No'}</span>
                    <span>
                      <Link href={i.details.url} target="_blank">
                        {i.details.url}
                      </Link>
                    </span>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )
      })()}

      {!list.isConnected ? (
        <WalletWidget />
      ) : (
        <>
          <VerifierInput
            claim={claim}
            contributers={contributors}
            contributersStateHandler={setContributors}
            symbol={list.workflow.data?.ERC20Symbol}
          />
          <Button
            onClick={onVerify}
            disabled={!list.isConnected || !!claim?.claimed}
            color="primary"
          >
            Verify Claim
          </Button>
        </>
      )}
    </>
  )
}
