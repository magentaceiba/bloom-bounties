import { get } from '@/lib/actions/claim'
import { ClientClaimPage } from './page.client'
import { helper } from '@/lib/utils'
import { HasError } from '@/components'

type Props = {
  params: { id: string }
}

export default async function ClaimPage({ params }: Props) {
  const { id } = params
  const { error, data } = await helper.pageData(() => get(id))

  if (error !== null) return <HasError error={error} />

  return <ClientClaimPage claim={data} />
}
