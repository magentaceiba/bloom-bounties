import { Checkbox } from 'react-daisyui'
import { Frame, NoData, NumberInput } from './ui'
import Copy from './ui/Copy'
import { ClaimObject, VerifyContributers } from '@/lib/types/claim'
import { compressAddress } from '@/lib/utils'

export function VerifierInput({
  claim,
  contributers,
  contributersStateHandler,
  symbol,
}: {
  claim: ClaimObject
  contributers?: VerifyContributers
  contributersStateHandler: (contributers: VerifyContributers) => void
  symbol?: string
}) {
  const handleState = ({
    addr,
    claimAmount,
    include,
  }: VerifyContributers[0]) => {
    const newContributers = contributers?.map((c) => {
      if (c.addr === addr) {
        if (include !== undefined) return { ...c, include }
        return { ...c, claimAmount }
      }

      return c
    })

    if (!newContributers) return

    contributersStateHandler(newContributers)
  }

  if (!contributers) return <NoData />

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      {contributers.map(({ addr, include }, index) => {
        const standingClaimAmount =
          Number(claim?.contributors?.[index]?.claimAmount) ?? 0
        return (
          <Frame key={index}>
            <div className="flex items-center justify-between w-full">
              <h3>Contributer Adress</h3>
              <div className="flex items-center gap-3">
                <h4>Include</h4>
                <Checkbox
                  checked={include}
                  onChange={(e) => {
                    handleState({ addr, include: e.target.checked })
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p>{compressAddress(addr)}</p> <Copy data={addr} />
            </div>
            <NumberInput
              label={`Proposal Amount ${symbol} ( max ${standingClaimAmount} )`}
              onChange={(e) => {
                handleState({ addr, claimAmount: e })
              }}
              min={0}
              max={standingClaimAmount}
              required
            />
          </Frame>
        )
      })}
    </div>
  )
}
