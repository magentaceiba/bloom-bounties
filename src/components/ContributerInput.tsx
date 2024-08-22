import { Button } from 'react-daisyui'
import { Frame, Input } from './ui'
import { IoClose } from 'react-icons/io5'
import { cn } from '@/styles/cn'
import { InitialContributor } from '@/lib/types/claim'

export function ContributerInput({
  contributors,
  onUrlChange,
  contributersStateHandler,
  symbol,
  maximumPayoutAmount,
  canEditContributor,
}: {
  contributors: InitialContributor[]
  contributersStateHandler: (contributors: InitialContributor[]) => void
  onUrlChange?: (url: string) => void
  symbol?: string
  maximumPayoutAmount?: string
  canEditContributor?: boolean
}) {
  const addContributer = () => {
    contributersStateHandler([
      ...contributors,
      {
        uid: crypto.randomUUID(),
        addr: undefined,
        claimAmount: undefined,
      },
    ])
  }

  const handleState = ({ uid, addr, claimAmount }: InitialContributor) => {
    const newContributers = contributors.map((c) => {
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
    const newContributers = contributors.filter((c) => c.uid !== uid)
    contributersStateHandler(newContributers)
  }

  return (
    <div className="flex flex-col w-full max-w-xl">
      {!!onUrlChange && (
        <Input.Text
          label="Proposal URL"
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
        <Frame key={index} className="mt-6 relative">
          <IoClose
            // @ts-ignore
            className={cn(
              'rounded-box cursor-pointer btn-ghost p-0 absolute right-3 top-3',
              index === 0 && 'hidden'
            )}
            // @ts-ignore
            size={30}
            // @ts-ignore
            onClick={() => {
              removeContributer(c.uid)
            }}
            // @ts-ignore
            disabled={canEditContributor === false}
          />
          <Input.Text
            label={`Contributer ${index + 1} Address`}
            onChange={(e) => {
              handleState({ uid: c.uid, addr: e as `0x${string}` })
            }}
            type="address"
            defaultValue={c.addr}
            required
          />
          <Input.Number
            label={`Proposal Amount ${symbol}`}
            onChange={(e) => {
              handleState({ uid: c.uid, claimAmount: e })
            }}
            max={
              !!maximumPayoutAmount ? Number(maximumPayoutAmount) : undefined
            }
            defaultValue={c.claimAmount}
            required
          />
        </Frame>
      ))}
    </div>
  )
}
