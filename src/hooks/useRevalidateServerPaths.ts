'use clinet'

import { revalidateServerPaths } from '@/lib/actions/utils'
import { useServerAction } from '.'

export default function useRevalidateServerPaths() {
  const serverAction = useServerAction()

  return (paths: string[]) =>
    serverAction(() => revalidateServerPaths('client', paths))
}
