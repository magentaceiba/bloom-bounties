'use client'

import { compressAddress, firstLetterToUpper } from '@/lib/utils'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { EditableText, NumberInput } from '@/components/ui'
import { Badge, Button, Divider, Loading } from 'react-daisyui'
import { useWorkflow } from '@/hooks/useWorkflow'
import { parseUnits, stringToHex } from 'viem'
import { FormattedBountyDetails } from '@/lib/types/bounty'
import { useToast } from '@/providers'
import { WalletWidget } from '@/components'
import { useMutation } from '@tanstack/react-query'

export default function PostPage() {
  const addToast = useToast()
  const { address } = useAccount()
  const [details, setDetails] = useState({
    title: '',
    description: '',
    url: '',
  })
  const [minimumPayoutAmount, setMinimumPayoutAmount] = useState('')
  const [maximumPayoutAmount, setMaximumPayoutAmount] = useState('')

  const fields = ['title', 'description', 'url'] as const

  const workflow = useWorkflow()

  const postMutation = useMutation({
    mutationKey: ['postBounty'],
    mutationFn: async () => {
      if (!workflow.data) return

      const parsedDetails = stringToHex(
        JSON.stringify({
          ...details,
          creatorAddress: address,
          date: new Date().toISOString(),
        } satisfies FormattedBountyDetails)
      )

      const args = [
        // Minimum Payout
        parseUnits(minimumPayoutAmount, workflow.data.ERC20Decimals),
        // Maximum Payout
        parseUnits(maximumPayoutAmount, workflow.data.ERC20Decimals),
        // Details
        parsedDetails,
        // '0x0',
      ] as const

      try {
        const thxHash =
          await workflow.data.contracts.logic.write.addBounty(args)
        addToast({ text: `Bounty Posted: ${thxHash}`, status: 'success' })
      } catch (err: any) {
        addToast({ text: err?.message, status: 'error' })
      }
    },
  })

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex flex-col justify-center p-3">
        {fields.map((i, index) => (
          <div key={index}>
            <EditableText
              invalid={false}
              label={firstLetterToUpper(i)}
              value={details[i]}
              setValue={(value) =>
                setDetails((prev) => ({ ...prev, [i]: value }))
              }
            />
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

      <div className="flex flex-col gap-6 h-max my-auto">
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

        {!workflow.data?.isConnected ? (
          <WalletWidget />
        ) : (
          <Button
            color={'primary'}
            onClick={() => postMutation.mutate()}
            loading={postMutation.isPending}
          >
            Post Bounty
          </Button>
        )}
      </div>
    </div>
  )
}
