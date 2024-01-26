'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'
import { useBounty } from '@/hooks/useBounty'
import { useState } from 'react'
import { Button, Loading } from 'react-daisyui'
import { NoData, WalletWidget } from './components'
import { FundingStats } from './components/FundingStats'
import { BountyDetails } from './components/BountyDetails'
import Link from 'next/link'

export default function Page() {
  const { list, isConnected } = useBounty()
  const [swiperIndex, setSwiperIndex] = useState<number>(0)

  const bounty = list.data?.[swiperIndex ?? 0]
  return (
    <>
      <FundingStats />

      {(() => {
        if (list.isPending) return <Loading className={'m-4'} />

        if (!list.data?.length) return <NoData />

        return (
          <div className="w-60">
            <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards]}>
              {list.data.map((bounty, index) => (
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
                  {({ isActive }) => {
                    isActive && swiperIndex !== index && setSwiperIndex(index)
                    return (
                      <BountyDetails.Main
                        title={bounty.details?.title}
                        minimumPayoutAmount={bounty.minimumPayoutAmount}
                        maximumPayoutAmount={bounty.maximumPayoutAmount}
                        symbol={bounty.symbol}
                        creatorAddress={bounty.details?.creatorAddress}
                      />
                    )
                  }}
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
