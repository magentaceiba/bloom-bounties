import { getList } from '../lib/actions/bounty'
import PageClient from './page.client'

export default async function Page() {
  const data = await getList()

  return <PageClient list={data} />
}
