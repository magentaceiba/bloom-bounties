'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'
import { useState } from 'react'
import { Button, Loading /* , Table */ } from 'react-daisyui'
import { NoData, WalletWidget } from '../components'
import { FundingStats } from '../components/FundingStats'
import { BountyDetails } from '../components/BountyDetails'
import Link from 'next/link'
import { FormattedBounty } from '../lib/types/bounty'
import { useAccount } from 'wagmi'
// import cn from 'classnames'

export default function PageClient({
  list,
  isPending,
}: {
  list: FormattedBounty[]
  isPending: boolean
}) {
  const { isConnected } = useAccount()
  const [swiperIndex, setSwiperIndex] = useState<number>(0)
  // const [selected, setSelected] = useState<number>(0)

  const bounty = list[swiperIndex ?? 0]
  // const bounty = list[selected ?? 0]
  return (
    <>
      <FundingStats />

      {/* {(() => {
        if (isPending) return <Loading className={'m-4'} />

        if (!list.length) return <NoData />

        return (
          <div className="overflow-y-scroll w-full max-w-4xl py-10 max-h-64">
            <Table>
              <Table.Head>
                <span>Bounty ID</span>
                <span>Claimed</span>
                <span>URL</span>
              </Table.Head>

              <Table.Body>
                {list.map((i, index) => (
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
      })()} */}

      {(() => {
        if (isPending) return <Loading className={'m-4'} />

        if (!list?.length) return <NoData />

        return (
          <div className="w-60">
            <Swiper
              effect={'cards'}
              grabCursor={true}
              modules={[EffectCards]}
              onSlideChange={(swiper) => setSwiperIndex(swiper.activeIndex)}
            >
              {list.map((bounty, index) => (
                <SwiperSlide
                  key={index}
                  className="bg-base-200 border border-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '18px',
                    fontSize: '22px',
                  }}
                >
                  <BountyDetails.Main
                    title={bounty.details?.title}
                    minimumPayoutAmount={bounty.minimumPayoutAmount}
                    maximumPayoutAmount={bounty.maximumPayoutAmount}
                    symbol={bounty.symbol}
                    creatorAddress={bounty.details?.creatorAddress}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )
      })()}

      <BountyDetails.Description
        description={bounty?.details?.description}
        url={bounty?.details?.url}
      />
      {!isConnected ? (
        <WalletWidget />
      ) : (
        <>
          {!!bounty?.id && (
            <Link href={`/claim/${bounty.id}`}>
              <Button color="primary">Claim Bounty</Button>
            </Link>
          )}
        </>
      )}
    </>
  )
}
