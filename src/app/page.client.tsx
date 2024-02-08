'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'
import { useState } from 'react'
import { Button, Loading } from 'react-daisyui'
import { InteractiveTable, NoData, Tabs, WalletWidget } from '../components'
import { FundingStats } from '../components/FundingStats'
import { BountyDetails } from '../components/BountyDetails'
import Link from 'next/link'
import { FormattedBounty } from '../lib/types/bounty'
import { useAccount } from 'wagmi'

const tabs = ['List', 'Card'] as const

export default function PageClient({
  list,
  isPending,
}: {
  list: FormattedBounty[]
  isPending: boolean
}) {
  const { isConnected } = useAccount()
  const [tab, setTab] = useState(0)
  const [index, setIndex] = useState<number>(0)
  const bounty = list[index ?? 0]

  return (
    <>
      <FundingStats />

      <div className="flex flex-col items-center gap-6 w-full max-w-xl">
        <Tabs
          variant="boxed"
          setTab={setTab}
          tab={tab}
          tabs={tabs as unknown as string[]}
        />

        {(() => {
          if (tab === 0)
            return (
              <InteractiveTable
                isPending={isPending}
                heads={['Bounty ID', 'Title']}
                rows={list.map((i) => ({
                  row: [{ item: String(i.id) }, { item: i.details!.title! }],
                }))}
                onSelect={(index) => setIndex(index)}
              />
            )

          if (isPending) return <Loading className={'m-4'} />

          if (!list?.length) return <NoData />

          return (
            <div className="w-60">
              <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards]}
                onSlideChange={(swiper) => setIndex(swiper.activeIndex)}
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
      </div>

      {tab === 1 ? (
        <BountyDetails.Description
          description={bounty?.details?.description}
          url={bounty?.details?.url}
        />
      ) : (
        <BountyDetails.DetailedDescription
          description={bounty?.details?.description}
          url={bounty?.details?.url}
          minimumPayoutAmount={bounty.minimumPayoutAmount}
          maximumPayoutAmount={bounty.maximumPayoutAmount}
          symbol={bounty.symbol}
          creatorAddress={bounty.details?.creatorAddress}
        />
      )}

      {!isConnected ? (
        <WalletWidget />
      ) : (
        <>
          {!!bounty?.id && (
            <Link href={`/claims/${bounty.id}`}>
              <Button color="primary">Claim Bounty</Button>
            </Link>
          )}
        </>
      )}
    </>
  )
}
