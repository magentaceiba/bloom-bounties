'use client'

import { compressAddress, firstLetterToUpper } from '@/lib/utils'
import { EditableText, NumberInput } from '@/components/ui'
import { Badge, Button, Divider } from 'react-daisyui'
import { WalletWidget } from '@/components'
import { useBounty } from '@/hooks/useBounty'
import { useState } from 'react'

export default function PostPage() {
  const fields = ['title', 'description', 'url'] as const

  const [details, setDetails] = useState({
    title: '',
    description: '',
    url: '',
  })
  const [minimumPayoutAmount, setMinimumPayoutAmount] = useState('')
  const [maximumPayoutAmount, setMaximumPayoutAmount] = useState('')

  const { ERC20Symbol, post, address, isConnected } = useBounty()
  const { mutate, isPending } = post

  const onMutate = () => {
    mutate({
      details,
      minimumPayoutAmount,
      maximumPayoutAmount,
    })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex flex-col justify-center p-3">
        {fields.map((i, index) => (
          <div key={index}>
            <EditableText
              invalid={false}
              label={firstLetterToUpper(i)}
              value={details[i]}
              onChange={(value) =>
                setDetails((prev) => ({ ...prev, [i]: value }))
              }
            />
            <Divider />
          </div>
        ))}

        <div className="flex justify-center flex-wrap gap-3">
          <Badge>
            Min Payout | {minimumPayoutAmount} {ERC20Symbol}
          </Badge>
          <Badge>
            Max Payout | {maximumPayoutAmount} {ERC20Symbol}
          </Badge>
          <Badge>
            Creator |{' '}
            {compressAddress(
              address ?? '0x0000000000000000000000000000000000000000'
            )}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-6 h-max my-auto items-center">
        <NumberInput
          label="Minimum Payment Amount"
          value={minimumPayoutAmount}
          onChange={(e) => setMinimumPayoutAmount(e)}
        />

        <NumberInput
          label="Maximum Payment Amount"
          value={maximumPayoutAmount}
          onChange={(e) => setMaximumPayoutAmount(e)}
        />

        {!isConnected ? (
          <WalletWidget />
        ) : (
          <Button
            color={'primary'}
            onClick={onMutate}
            loading={isPending}
            disabled={isPending}
          >
            Post Bounty
          </Button>
        )}
      </div>
    </div>
  )
}
