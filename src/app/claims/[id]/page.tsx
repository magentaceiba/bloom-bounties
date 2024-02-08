import { get } from '@/lib/actions/claim'
import { ClientClaimPage } from './page.client'

type Props = {
  params: { id: string }
}

export default async function ClaimPage({ params }: Props) {
  const { id } = params
  let isPending = false
  let claim: Awaited<ReturnType<typeof get>>
  try {
    isPending = true
    claim = await get(id)
  } finally {
    isPending = false
  }
  return <ClientClaimPage isPending={isPending} claim={claim} />
}
