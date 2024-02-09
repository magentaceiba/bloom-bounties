import { getList } from '@/lib/actions/claim'
import PageClient from './page.client'
import { handlePageData } from '@/lib/utils'
import { HasError } from '@/components'

export default async function Page() {
  const { data, error } = await handlePageData(getList)

  if (error !== null) return <HasError error={error} />

  return <PageClient list={data} />
}
