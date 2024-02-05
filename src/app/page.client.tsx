'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'
import { useState } from 'react'
import { Button, Loading, Menu } from 'react-daisyui'
import { InteractiveTable, NoData, WalletWidget } from '../components'
import { FundingStats } from '../components/FundingStats'
import { BountyDetails } from '../components/BountyDetails'
import Link from 'next/link'
import { FormattedBounty } from '../lib/types/bounty'
import { useAccount } from 'wagmi'
import cn from 'classnames'
import { firstLetterToUpper } from '@/lib/utils'

export default function PageClient({
  list,
  isPending,
}: {
  list: FormattedBounty[]
  isPending: boolean
}) {
  const { isConnected } = useAccount()
  const [viewType, setViewType] = useState<'list' | 'card'>('list')
  const [index, setIndex] = useState<number>(0)
  const bounty = list[index ?? 0]

  return (
    <>
      <FundingStats />

      <div className="flex flex-col items-center gap-6 w-full max-w-xl">
        <Menu horizontal className="bg-base-200 rounded-box">
          {(['list', 'card'] as const).map((type, index) => (
            <Menu.Item key={type} className={cn(index === 0 && 'mr-2')}>
              <a
                className={cn(type === viewType && 'active')}
                onClick={() => {
                  setViewType(type)
                }}
              >
                {firstLetterToUpper(type)}
              </a>
            </Menu.Item>
          ))}
        </Menu>

        {(() => {
          if (viewType === 'list')
            return (
              <InteractiveTable
                isPending={isPending}
                heads={['Bounty ID', 'Title']}
                rows={list.map((i) => ({
                  row: [{ item: String(i.id) }, { item: i.details!.title! }],
                }))}
                onSelect={(index) => setIndex(index)}
                extraPadding={false}
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

      {viewType === 'card' ? (
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
            <Link href={`/claim/${bounty.id}`}>
              <Button color="primary">Claim Bounty</Button>
            </Link>
          )}
        </>
      )}
    </>
  )
}
