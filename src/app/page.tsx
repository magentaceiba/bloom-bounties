import { helper } from '@/lib/utils'
import { getList } from '../lib/actions/bounty'
import PageClient from './page.client'
import { HasError } from '@/components'

export default async function Page() {
  const { data, error } = await helper.pageData(getList)

  if (error !== null) return <HasError error={error} />

  return <PageClient list={data} />
}
