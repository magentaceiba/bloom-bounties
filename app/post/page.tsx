'use client'

import { compressAddress, firstLetterToUpper } from '@/lib/utils'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { NumberInput } from '@/components/ui'
import { Alert, Badge, Button, Divider, Input, Loading } from 'react-daisyui'
import { useWorkflowConfig } from '@/hooks/useWorkflowConfig'
import { parseUnits, stringToHex } from 'viem'
import { FormattedBountyDetails } from '@/lib/types/bounty'

export default function PostPage() {
  const { address } = useAccount()
  const [details, setDetails] = useState({
    title: '',
    description: '',
    url: '',
  })
  const [minimumPayoutAmount, setMinimumPayoutAmount] = useState('')
  const [maximumPayoutAmount, setMaximumPayoutAmount] = useState('')

  const fields = ['title', 'description', 'url'] as const

  const workflowConfig = useWorkflowConfig()

  const onPost = () => {
    if (!workflowConfig.data) return

    const parsedDetails = stringToHex(
      JSON.stringify({
        ...details,
        creatorAddress: address,
        date: new Date().toISOString(),
      } satisfies FormattedBountyDetails)
    )

    const args = [
      // Minimum Payout
      parseUnits(minimumPayoutAmount, workflowConfig.data.ERC20Decimals),
      // Maximum Payout
      parseUnits(maximumPayoutAmount, workflowConfig.data.ERC20Decimals),
      // Details
      parsedDetails,
      // '0x0',
    ] as const

    workflowConfig.data.contracts.logic.write
      .addBounty(args)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto">
      {false ? (
        <Loading />
      ) : (
        <div className="flex flex-col justify-center p-3">
          {fields.map((i, index) => (
            <div key={index}>
              <div className="flex flex-col gap-1">
                <h4>{firstLetterToUpper(i)}</h4>
                <p>{details[i]}</p>
              </div>
              <Divider />
            </div>
          ))}

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

      <Button color={'primary'} onClick={onPost}>
        Post Bounty
      </Button>

      {fields.map((i, index) => (
        <div className="form-control" key={index}>
          <label className="label">
            <span className="label-text">{firstLetterToUpper(i)}</span>
          </label>
          <Input
            placeholder={`...${i} of the bounty`}
            value={details[i]}
            onChange={(e) => {
              setDetails((prev) => ({ ...prev, [i]: e.target.value }))
            }}
          />
        </div>
      ))}

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
    </div>
  )
}
