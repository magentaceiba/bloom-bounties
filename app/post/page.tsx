'use client'

import { compressAddress } from '@/lib/utils'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { NumberInput } from '@/components/ui'
import { Alert, Badge, Button, Divider, Input, Loading } from 'react-daisyui'

export default function PostPage() {
  const { address } = useAccount()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [minimumPayoutAmount, setMinimumPayoutAmount] = useState('')
  const [maximumPayoutAmount, setMaximumPayoutAmount] = useState('')

  return (
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto">
      {false ? (
        <Loading />
      ) : (
        <div className="flex flex-col justify-center p-3">
          <div className="flex gap-3 items-center">
            <h3>Title |</h3>
            <p>{title}</p>
          </div>

          <Divider />

          <div className="flex gap-3 items-center">
            <h3>Description |</h3>
            <p>{description}</p>
          </div>

          <Divider />

          <div className="flex justify-center flex-wrap gap-3">
            <Badge>Min Payout | {minimumPayoutAmount} USDC</Badge>
            <Badge>Max Payout | {maximumPayoutAmount} USDC</Badge>
            <Badge>
              Creator |{' '}
              {compressAddress(
                address ?? '0x0000000000000000000000000000000000000000'
              )}
            </Badge>
          </div>
        </div>
      )}

      <Button>Post Bounty</Button>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <Input
          placeholder="...title of the bounty"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <Input
          placeholder="...description of the bounty"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

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

      <Alert>Details about how to use the post func</Alert>
    </div>
  )
}
