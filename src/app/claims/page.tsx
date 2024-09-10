'use client'

import { useEffect, useState } from 'react'
import { Button, Loading } from 'react-daisyui'
import { WalletWidget } from '@/components'
// import { FundingStats } from '@/components/FundingStats'
import useClaim from '@/hooks/useClaim'
import { InitialContributor } from '@/lib/types/claim'
import { useRole } from '@/hooks'
import { NoAccess, InteractiveTable } from '@/components/ui/'
import { ContributerInput } from '@/components/ContributerInput'

export default function ClaimsPage() {
  const { roles } = useRole()
  const { isConnected, ERC20Symbol, contributorsList, editContributors } =
    useClaim()
  const [selected, setSelected] = useState<number>(0)
  const [contributors, setContributors] = useState<InitialContributor[]>([])

  const list = contributorsList.data ?? []
  const claim = list[selected ?? 0]

  useEffect(() => {
    if (claim)
      setContributors(
        claim.contributors.map((i) => ({ ...i, uid: crypto.randomUUID() }))
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, claim?.bountyId])

  // const total = contributors.reduce((acc, i) => acc + Number(i.claimAmount), 0)

  // const isTotalValid =
  //   total >= Number(bounty.minimumPayoutAmount) &&
  //   total <= Number(bounty.maximumPayoutAmount)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!claim || !contributors) return

    const mapped = contributors.map(
      ({ uid, ...rest }) => rest as Required<typeof rest>
    )

    editContributors.mutate({
      claimId: String(claim.claimId),
      contributors: mapped,
    })
  }

  if (!isConnected) return <WalletWidget />

  if (roles.isPending) return <Loading />

  if (!roles.data?.isClaimer) return <NoAccess />

  const rows = list.map(
    (i) =>
      [
        { item: i.claimId },
        { item: i.claimed ? 'Yes' : 'No' },
        { item: i.details.url, type: 'url' },
      ] as any
  )

  return (
    <>
      {/* <FundingStats /> */}

      <InteractiveTable
        onSelect={(index) => setSelected(index)}
        heads={['Claim ID', 'Verified?', 'URL']}
        rows={rows}
        className="pt-10 max-w-xl"
      />

      {/* Display claim.claimId */}
      {claim && (
        <div className="my-4 p-4 bg-gray-800 text-gray-100 rounded-md w-full max-w-xl flex justify-between gap-5">
          <h2 className="text-base font-normal ">
            Selected Claim ID: {claim.claimId}
          </h2>
          <h2 className="text-base font-normal">URL: {claim.details.url}</h2>
        </div>
      )}
      <h4 className="flex place-self-start text-left ml-0 font-bold">
        View/Edit Your Claim
      </h4>
      {(() => {
        if (!isConnected) return <WalletWidget />

        return (
          <form
            onSubmit={onSubmit}
            className="form-control gap-6 w-full max-w-xl"
          >
            <ContributerInput
              contributors={contributors}
              contributersStateHandler={setContributors}
              symbol={ERC20Symbol}
              canEditContributor={!claim?.claimed}
            />
            <Button
              loading={editContributors.isPending}
              disabled={editContributors.isPending || claim?.claimed}
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </form>
        )
      })()}
    </>
  )
}
