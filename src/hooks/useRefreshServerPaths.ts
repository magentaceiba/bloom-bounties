'use clinet'

import { revalidateServerPaths, getPathState } from '@/lib/actions/paths'
import { useServerAction } from '.'
import {
  PathState,
  PathStatePostRequest,
  PathsCorrespondingTo,
} from '@/lib/types/revalidate'
import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import _ from 'lodash'

const initialState: PathState = {
  bounties: 0,
  verify: 0,
  claims: 0,
}

export function useRefreshServerPaths() {
  const serverAction = useServerAction()

  const post = (paths: PathStatePostRequest[]) => {
    serverAction(() => revalidateServerPaths('client', paths))
  }

  return { post }
}

function findDifferences<T extends PathState>(obj1: T, obj2: T): (keyof T)[] {
  const changedKeys: (keyof T)[] = []

  Object.keys(obj1).forEach((k) => {
    const key = k as keyof T
    if (!_.isEqual(obj1[key], obj2[key])) {
      changedKeys.push(key)
    }
  })

  return changedKeys
}

export default function useHandleClientPathState() {
  const pathname = usePathname()
  const router = useRouter()
  const serverAction = useServerAction()
  const get = () => serverAction(() => getPathState('client'))

  const currentState = useRef<PathState>(initialState)
  const pendingRefreshes = useRef<PathStatePostRequest[]>([])

  const removePending = (path: PathStatePostRequest) => {
    pendingRefreshes.current = pendingRefreshes.current.filter(
      (p) => p !== path
    )
  }

  const handle = async () => {
    const newState = await get(),
      changes = findDifferences(newState, currentState.current),
      hasChange = changes?.length > 0

    if (!hasChange) return

    const changeIsCurrent = changes.find(
      (c) => PathsCorrespondingTo[c] === pathname
    )

    const pendingIsCurrent = pendingRefreshes.current.find(
      (p) => PathsCorrespondingTo[p] === pathname
    )

    if (changeIsCurrent || pendingIsCurrent) router.refresh()
    // remove the pending refresh if the refresh was performed on the pending path
    if (pendingIsCurrent) removePending(pendingIsCurrent)

    // update the current state after the refresh
    currentState.current = newState

    // add the changes to the pending refreshes if they are not already there
    changes.forEach((changed) => {
      if (!pendingRefreshes.current.includes(changed))
        pendingRefreshes.current.push(changed)
    })
  }

  // get and set the current state every 20 seconds if the new state is different
  useEffect(() => {
    handle()
    const interval = setInterval(() => {
      handle()
    }, 10_000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
