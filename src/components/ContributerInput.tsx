import { Button } from 'react-daisyui'
import { Frame, NumberInput, TextInput } from './ui'
import { IoClose } from 'react-icons/io5'
import cn from 'classnames'

export type Contributers = {
  uid: string
  addr?: `0x${string}`
  claimAmount?: string
}[]

export function ContributerInput({
  contributers,
  url,
  onUrlChange,
  contributersStateHandler,
  symbol,
  maximumPayoutAmount,
}: {
  contributers: Contributers
  contributersStateHandler: (contributers: Contributers) => void
  onUrlChange: (url: string) => void
  url: string
  symbol?: string
  maximumPayoutAmount: string
}) {
  const handleState = ({ uid, addr, claimAmount }: Contributers[0]) => {
    const newContributers = contributers.map((c) => {
      if (c.uid === uid) {
        if (addr !== undefined) return { ...c, addr }
        if (claimAmount !== undefined) return { ...c, claimAmount }
        return c
      }
      return c
    })
    contributersStateHandler(newContributers)
  }

  const removeContributer = (uid: string) => {
    const newContributers = contributers.filter((c) => c.uid !== uid)
    contributersStateHandler(newContributers)
  }

  return (
    <div className="flex flex-col w-full max-w-xl">
      <TextInput
        label="Proposal URL"
        type="url"
        value={url}
        onChange={onUrlChange}
        required
      />
      <Button
        className="mt-6"
        color="primary"
        size="sm"
        type="button"
        onClick={() => {
          contributersStateHandler([
            ...contributers,
            {
              uid: crypto.randomUUID(),
              addr: undefined,
              claimAmount: undefined,
            },
          ])
        }}
      >
        Add Contributor
      </Button>
      {contributers.map((c, index) => (
        <Frame key={index} className="mt-6 relative">
          <IoClose
            className={cn(
              'rounded-box cursor-pointer btn-ghost p-0 absolute right-3 top-3',
              index === 0 && 'hidden'
            )}
            size={30}
            onClick={() => {
              removeContributer(c.uid)
            }}
          />
          <TextInput
            label={`Contributer ${index + 1} Address`}
            onChange={(e) => {
              handleState({ uid: c.uid, addr: e as `0x${string}` })
            }}
            type="address"
            required
          />
          <NumberInput
            label={`Proposal Amount ${symbol}`}
            onChange={(e) => {
              handleState({ uid: c.uid, claimAmount: e })
            }}
            max={Number(maximumPayoutAmount)}
            required
          />
        </Frame>
      ))}
    </div>
  )
}
