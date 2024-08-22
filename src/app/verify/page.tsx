import { getList } from '@/lib/actions/claim'
import PageClient from './page.client'

export default async function Page() {
  const data = await getList()

  return <PageClient list={data} />
}
