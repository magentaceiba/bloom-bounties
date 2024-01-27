import { Button } from 'react-daisyui'
import { EditableText, Frame, NumberInput } from './ui'
import { isAddress } from 'viem'

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
}: {
  contributers: Contributers
  contributersStateHandler: (contributers: Contributers) => void
  onUrlChange: (url: string) => void
  url: string
  symbol?: string
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

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <EditableText
        label="Proposal URL"
        type="url"
        value={url}
        onChange={onUrlChange}
      />
      <Button
        color="primary"
        size="sm"
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
        <Frame key={index}>
          <EditableText
            invalid={!isAddress(c.addr ?? '')}
            label={`Contributer ${index + 1} Address`}
            value={c.addr ?? ''}
            onChange={(e) => {
              handleState({ uid: c.uid, addr: e as `0x${string}` })
            }}
          />
          <NumberInput
            label={`Proposal Amount ${symbol}`}
            onChange={(e) => {
              handleState({ uid: c.uid, claimAmount: e })
            }}
            value={c.claimAmount ?? ''}
          />
        </Frame>
      ))}
    </div>
  )
}
