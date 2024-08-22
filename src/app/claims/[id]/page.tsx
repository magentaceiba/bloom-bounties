import { get } from '@/lib/actions/claim'
import { ClientClaimPage } from './page.client'

type Props = {
  params: { id: string }
}

export default async function ClaimPage({ params }: Props) {
  const { id } = params
  const data = await get(id)

  return <ClientClaimPage claim={data} />
}
