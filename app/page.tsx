import { getList } from './lib/actions/bounty'
import PageClient from './page.client'

export default async function Page() {
  let isPending = false
  let list: Awaited<ReturnType<typeof getList>> = []
  try {
    isPending = true
    list = await getList()
  } finally {
    isPending = false
  }

  return <PageClient list={list} isPending={isPending} />
}
