'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'
import { useState } from 'react'
import { Button } from 'react-daisyui'
import { InteractiveTable, NoData, Tabs, WalletWidget } from '../components'
import { FundingStats } from '../components/FundingStats'
import { BountyDetails } from '../components/BountyDetails'
import Link from 'next/link'
import { FormattedBounty } from '../lib/types/bounty'
import { useAccount } from 'wagmi'
import { FloTitle } from '@/components/FloTitle'

const tabs = ['List', 'Card'] as const

const headClass = 'text-{3E839B7} font-bold'

export default function PageClient({ list }: { list: FormattedBounty[] }) {
  const { isConnected } = useAccount()
  const [tab, setTab] = useState(0)
  const [index, setIndex] = useState<number>(0)
  const bounty = list[index ?? 0]

  return (
    <>
      {/* <FundingStats /> */}
      <FloTitle />

      <div className="flex flex-col items-center gap-6 w-full max-w-xl">
        <div className="text-white text-xl font-bold text-center mt-4">
          Available Bounties
        </div>
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
                heads={['Bounty ID', 'Title']}
                rows={list.map((i) => [
                  { item: String(i.id) },
                  { item: i.details!.title! },
                ])}
                onSelect={(index) => setIndex(index)}
              />
            )

          if (!list?.length) return <NoData />

          return (
            <div className="w-60">
              <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards]}
                onSlideChange={(swiper: any) => setIndex(swiper.activeIndex)}
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
                      minimumPayoutAmount={bounty?.minimumPayoutAmount}
                      maximumPayoutAmount={bounty?.maximumPayoutAmount}
                      symbol={bounty?.symbol}
                      creatorAddress={bounty?.details?.creatorAddress}
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
          minimumPayoutAmount={bounty?.minimumPayoutAmount}
          maximumPayoutAmount={bounty?.maximumPayoutAmount}
          symbol={bounty?.symbol}
          creatorAddress={bounty?.details?.creatorAddress}
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
