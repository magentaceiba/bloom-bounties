import { Button } from 'react-daisyui'
import { Frame, Input } from './ui'
import { IoClose } from 'react-icons/io5'
import { cn } from '@/styles/cn'
import { InitialContributor } from '@/lib/types/claim'
// import { useEffect, useState } from 'react'
// import axios from 'axios'

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
  // const [validAddresses, setValidAddresses] = useState<string[]>([])
  // const [formValid, setFormValid] = useState<boolean>(true)

  // useEffect(() => {
  //   async function fetchValidAddresses() {
  //     try {
  //       const response = await axios.get(
  //         'https://dev-bloomnetwork.netlify.app/.netlify/functions/bountyapi'
  //       )
  //       // Filter out null values from the response
  //       const addresses = response.data.filter(
  //         (address: string | null) => address !== null
  //       )
  //       setValidAddresses(addresses)
  //     } catch (error) {
  //       console.error(
  //         'Error fetching wallet addresses:',
  //         (error as Error).message
  //       )
  //     }
  //   }

  //   fetchValidAddresses()
  // }, [])

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
        // let validationError = ''
        let updatedClaimAmount =
          claimAmount !== undefined ? claimAmount : c.claimAmount

        // Validation logic for address
        // if (addr !== undefined) {
        //   if (!addr.trim()) {
        //     validationError = 'Please enter a wallet address'
        //   } else if (!validAddresses.includes(addr.trim())) {
        //     validationError =
        //       'Invalid wallet address - if you know this is the address of one of your Local Bloom members, you need to ask them to add it to their BloomNetwork.earth profile, before you are able to include them in a bounty claim.'
        //   }
        // }

        const contributorWithValidation: ContributorWithValidation = {
          ...c,
          addr: addr !== undefined ? addr : c.addr,
          claimAmount:
            updatedClaimAmount !== undefined
              ? updatedClaimAmount
              : c.claimAmount,
          // validationError,
        }

        return contributorWithValidation
      }
      return c
    })

    // const isFormValid = newContributers.every(
    //   (c) => !c.validationError || c.validationError === ''
    // )

    // // Update state
    // setFormValid(isFormValid)
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
      {/* Instructions for adding participant addresses */}
      <div className="mt-6">
        Paste impact participants wallet addresses below for payout. <br />
        <span className="italic">
          *Only members of BloomNetwork.earth are eligible.*{' '}
        </span>
        <br /> <br />
        <div className=" text-sm">
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              width="20"
              height="20"
              xmlSpace="preserve"
            >
              <path
                d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h140.1l67.9 67.9V320c0 8.8-7.2 16-16 16zm-192 48h192c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9l-67.8-67.9c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64v256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64v256c0 35.3 28.7 64 64 64h192c35.3 0 64-28.7 64-64v-32h-48v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16h32v-48H64z"
                style={{ fill: '#79f8fb' }}
              />
            </svg>
            <a
              href="https://bloomnetwork.earth/member/localactionrewards/localmembers"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-300 mb-3 ml-3"
            >
              Get your Local Bloom members addresses.
            </a>
          </div>
          <div className="flex">
            <svg
              id="b"
              xmlns="http://www.w3.org/2000/svg"
              width="25" // Twice as big as the original 32.5
              height="31.22" // Twice as big as the original 36.11
              viewBox="0 0 32.5 36.11"
            >
              <defs>
                <style>{`.d{fill:#79f8fb}`}</style>
              </defs>
              <g id="c">
                <path
                  className="d"
                  d="M0 25.88c0 2.49 2.02 4.51 4.51 4.51h12.1a8.133 8.133 0 0 0 7.76 5.71c4.48 0 8.12-3.65 8.12-8.12s-3.64-8.12-8.12-8.12c-.36 0-.71.03-1.05.08a9.863 9.863 0 0 0-6.44-5.19 8.09 8.09 0 0 0 3.43-6.62c0-4.48-3.64-8.13-8.12-8.13S4.06 3.65 4.06 8.13c0 2.74 1.36 5.16 3.44 6.63C3.2 15.84 0 19.74 0 24.38v1.51Zm30.69 2.11c0 3.49-2.84 6.32-6.32 6.32s-6.32-2.84-6.32-6.32 2.84-6.32 6.32-6.32 6.32 2.84 6.32 6.32ZM5.87 8.13c0-3.49 2.84-6.32 6.32-6.32s6.32 2.84 6.32 6.32-2.82 6.3-6.28 6.32h-.07a6.325 6.325 0 0 1-6.28-6.32ZM1.81 24.37c0-4.48 3.64-8.12 8.12-8.12H14.45c2.97 0 5.64 1.6 7.06 4.14-3.07 1.16-5.26 4.12-5.26 7.59 0 .2.02.4.03.6H4.52c-1.49 0-2.71-1.22-2.71-2.71v-1.51Z"
                />
                <path
                  className="d"
                  d="M21.67 28.89h1.81v1.81c0 .5.4.9.9.9s.9-.4.9-.9v-1.81h1.81c.5 0 .9-.4.9-.9s-.4-.9-.9-.9h-1.81v-1.81c0-.5-.4-.9-.9-.9s-.9.4-.9.9v1.81h-1.81c-.5 0-.9.4-.9.9s.4.9.9.9Z"
                />
              </g>
            </svg>
            <a
              href="https://bloomnetwork.earth/learn/faq/localmembers"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-300 ml-2"
            >
              Invite participants to join Bloom Network.
              {/* so they can claim their
           Bloom address. */}
            </a>
          </div>
        </div>
      </div>
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
          {/* {!c.validationError && ( // Render only if there's no validation error */}
          <>
            <div className="ml-1 text-sm my-1">Number of hours contributed</div>
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
          {/* )} */}
        </Frame>
      ))}
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
    </div>
  )
}
