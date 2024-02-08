import { handlePageData } from '@/lib/utils'
import { getList } from '../lib/actions/bounty'
import PageClient from './page.client'
import { HasError } from '@/components'

export default async function Page() {
  const { data, error } = await handlePageData(getList)

  if (error !== null) return <HasError error={error} />

  return <PageClient list={data} />
}
