import { Button } from 'react-daisyui'
import { Frame, Input } from './ui'
import { IoClose } from 'react-icons/io5'
import { cn } from '@/styles/cn'
import { InitialContributor } from '@/lib/types/claim'
import { useEffect, useState } from 'react'
import axios from 'axios'

// Define a new type extending InitialContributor with validationError
type ContributorWithValidation = InitialContributor & {
  validationError?: string
}

export function ContributerInput({
  contributors,
  onUrlChange,
  contributersStateHandler,
  symbol,
  maximumPayoutAmount,
  canEditContributor,
}: {
  contributors: ContributorWithValidation[]
  contributersStateHandler: (contributors: ContributorWithValidation[]) => void
  onUrlChange?: (url: string) => void
  symbol?: string
  maximumPayoutAmount?: string
  canEditContributor?: boolean
}) {
  const [validAddresses, setValidAddresses] = useState<string[]>([])
  const [formValid, setFormValid] = useState<boolean>(true)

  useEffect(() => {
    async function fetchValidAddresses() {
      try {
        const response = await axios.get(
          'https://dev-bloomnetwork.netlify.app/.netlify/functions/bountyapi'
        )
        // Filter out null values from the response
        const addresses = response.data.filter(
          (address: string | null) => address !== null
        )
        setValidAddresses(addresses)
      } catch (error) {
        console.error(
          'Error fetching wallet addresses:',
          (error as Error).message
        )
      }
    }

    fetchValidAddresses()
  }, [])

  const addContributer = () => {
    contributersStateHandler([
      ...contributors,
      {
        uid: crypto.randomUUID(),
        addr: undefined,
        claimAmount: undefined,
        validationError: '', // Add validationError property for each contributor
      },
    ])
  }

  const handleState = ({ uid, addr, claimAmount }: InitialContributor) => {
    const newContributers = contributors.map((c) => {
      if (c.uid === uid) {
        let validationError = ''
        let updatedClaimAmount =
          claimAmount !== undefined ? claimAmount : c.claimAmount

        // Validation logic for address
        if (addr !== undefined) {
          if (!addr.trim()) {
            validationError = 'Please enter a wallet address'
          } else if (!validAddresses.includes(addr.trim())) {
            validationError =
              'Invalid wallet address - if you know this is the address of one of your Local Bloom members, you need to ask them to add it to their BloomNetwork.earth profile, before you are able to include them in a bounty claim.'
          }
        }

        const contributorWithValidation: ContributorWithValidation = {
          ...c,
          addr: addr !== undefined ? addr : c.addr,
          claimAmount:
            updatedClaimAmount !== undefined
              ? updatedClaimAmount
              : c.claimAmount,
          validationError,
        }

        return contributorWithValidation
      }
      return c
    })

    const isFormValid = newContributers.every(
      (c) => !c.validationError || c.validationError === ''
    )

    // Update state
    setFormValid(isFormValid)
    contributersStateHandler(newContributers)
  }

  const removeContributer = (uid: string) => {
    const newContributers = contributors.filter((c) => c.uid !== uid)
    contributersStateHandler(newContributers)
  }

  return (
    <div className="flex flex-col w-full max-w-xl">
      {!!onUrlChange && (
        <Input.Text
          label="Proposal URL - your impact report"
          type="url"
          onChange={onUrlChange}
          required
        />
      )}

      <Button
        className="mt-6"
        color="primary"
        size="sm"
        type="button"
        onClick={addContributer}
        disabled={canEditContributor === false}
      >
        Add Contributor
      </Button>
      {contributors.map((c, index) => (
        <Frame key={c.uid} className="mt-6 relative">
          <IoClose
            className={cn(
              'rounded-box cursor-pointer btn-ghost p-0 absolute right-3 top-3',
              index === 0 && 'hidden'
            )}
            size={30}
            onClick={() => removeContributer(c.uid)}
            // @ts-ignore
            disabled={canEditContributor === false}
          />
          {/* Wallet address input */}
          {c.validationError && (
            <p className="text-red-500">{c.validationError}</p>
          )}
          <Input.Text
            label={`Participant ${index + 1} wallet address`}
            onChange={(e) => {
              handleState({ uid: c.uid, addr: e as `0x${string}` })
            }}
            type="address"
            defaultValue={c.addr}
            required
          />
          {/* Number of hours contributed */}
          {!c.validationError && ( // Render only if there's no validation error
            <>
              <div className="ml-1 text-sm my-1">
                Number of hours contributed
              </div>
              <div className="flex-grow flex items-center justify-between w-full">
                <Input.Number
                  onChange={(e) => {
                    const numberValue = e ? parseInt(e, 10) : undefined
                    const newClaimAmount =
                      numberValue !== undefined
                        ? (numberValue * 30).toString()
                        : undefined
                    handleState({
                      uid: c.uid,
                      claimAmount: newClaimAmount,
                    })
                  }}
                  max={
                    !!maximumPayoutAmount
                      ? Number(maximumPayoutAmount)
                      : undefined
                  }
                  defaultValue={
                    typeof c.claimAmount === 'string'
                      ? String(Number(c.claimAmount) / 30)
                      : '0'
                  }
                  required
                  style={{ width: '60px' }}
                  disabled={!!c.validationError}
                />
                {/* Display claim amount */}
                <div className="ml-4">
                  {c.claimAmount !== undefined && (
                    <div>
                      {c.claimAmount} {symbol}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </Frame>
      ))}
    </div>
  )
}
