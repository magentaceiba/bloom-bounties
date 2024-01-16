'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'
import { useBountyList } from '@/hooks/useBountyList'
import { compressAddress } from '@/lib/utils'
import { useState } from 'react'
import { Alert, Badge, Button, Divider, Loading } from 'react-daisyui'
import { dark } from 'styles'
import { NoData } from './components'

export default function Page() {
  const list = useBountyList()
  const [swiperIndex, setSwiperIndex] = useState<number>()

  const bounty = list.data?.[swiperIndex ?? 0]

  return (
    <div className="items-center flex flex-col gap-6 max-w-xl mx-auto">
      {(() => {
        if (list.isPending) return <Loading className={'m-4'} />

        if (!list.data?.length) return <NoData />

        return (
          <div className="w-60">
            <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards]}>
              {list.data.map((bounty, index) => (
                <SwiperSlide
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '18px',
                    fontSize: '22px',
                    backgroundColor: dark['base-200'],
                    border: `1px solid ${dark.primary}`,
                  }}
                >
                  {({ isActive }) => {
                    isActive && swiperIndex !== index && setSwiperIndex(index)
                    return (
                      <div className="items-center justify-center p-3">
                        <div className="flex gap-3">
                          <h4>Title |</h4>
                          <p>{bounty.details?.title ?? '...empty'}</p>
                        </div>

                        <Divider />

                        <div className="flex flex-wrap gap-3">
                          <Badge>
                            Min Payout | {bounty.minimumPayoutAmount}{' '}
                            {bounty.symbol}
                          </Badge>
                          <Badge>
                            Max Payout | {bounty.maximumPayoutAmount}{' '}
                            {bounty.symbol}
                          </Badge>
                          <Badge>
                            Creator |{' '}
                            {!!bounty.details?.creatorAddress
                              ? compressAddress(bounty.details.creatorAddress)
                              : '...empty'}
                          </Badge>
                        </div>
                      </div>
                    )
                  }}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )
      })()}

      <Alert>
        <div className="flex flex-col gap-3">
          <h4>Description</h4>
          <p>{bounty?.details.description ?? '..empty'}</p>
          <h4>URL</h4>
          <a href={bounty?.details.url ?? '/'} target="_blank" className="link">
            {bounty?.details.url ?? '..empty'}
          </a>
        </div>
      </Alert>

      <Button className="w-full">Claim Bounty</Button>
    </div>
  )
}
