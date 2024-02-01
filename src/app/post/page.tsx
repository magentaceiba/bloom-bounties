'use client'

import { compressAddress, firstLetterToUpper } from '@/lib/utils'
import { TextInput, NumberInput } from '@/components/ui'
import { Badge, Button, Divider } from 'react-daisyui'
import { WalletWidget } from '@/components'
import { useBounty } from '@/hooks/useBounty'
import { Fragment, useState } from 'react'

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

  const onMutate = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({
      details,
      minimumPayoutAmount,
      maximumPayoutAmount,
    })
  }

  return (
    <form className="flex flex-col lg:flex-row gap-6" onSubmit={onMutate}>
      <div className="flex flex-col justify-center p-3">
        {fields.map((i, index) => (
          <Fragment key={index}>
            <TextInput
              label={firstLetterToUpper(i)}
              value={details[i]}
              onChange={(value) =>
                setDetails((prev) => ({ ...prev, [i]: value }))
              }
              required
              type={i === 'url' ? 'url' : 'text'}
            />
            <Divider />
          </Fragment>
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
          onChange={(e) => setMinimumPayoutAmount(e)}
          required
        />

        <NumberInput
          label="Maximum Payment Amount"
          onChange={(e) => setMaximumPayoutAmount(e)}
          required
        />

        {!isConnected ? (
          <WalletWidget />
        ) : (
          <Button
            color={'primary'}
            type="submit"
            loading={isPending}
            disabled={isPending}
          >
            Post Bounty
          </Button>
        )}
      </div>
    </form>
  )
}
