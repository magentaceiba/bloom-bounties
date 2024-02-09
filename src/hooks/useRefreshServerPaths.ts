'use clinet'

import { revalidateServerPaths, getPathState } from '@/lib/actions/paths'
import { useServerAction } from '.'
import {
  PathState,
  PathStatePostRequest,
  PathsCorrespondingTo,
  initialPathsState,
} from '@/lib/types/paths'
import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { isEqual } from 'lodash'

// Hook to update and get the server paths cache
export function useRefreshServerPaths() {
  const serverAction = useServerAction()

  const post = (paths: PathStatePostRequest[]) => {
    serverAction(() => revalidateServerPaths('client', paths))
  }

  const get = () => serverAction(() => getPathState('client'))

  return { post, get }
}

// Top level Provider hook to handle the state changes
export default function useHandleClientPathState() {
  const pathname = usePathname()
  const router = useRouter()
  const { get } = useRefreshServerPaths()

  const currentState = useRef<PathState>(initialPathsState)
  const pendingRefreshes = useRef<PathStatePostRequest[]>([])

  const removePending = (path: PathStatePostRequest) => {
    pendingRefreshes.current = pendingRefreshes.current.filter(
      (p) => p !== path
    )
  }

  const handleFindDifferences = async () => {
    const newState = await get(),
      changes = findDifferences(newState, currentState.current),
      hasChange = changes?.length > 0

    return { newState, changes, hasChange }
  }

  const handle = async () => {
    const { newState, changes, hasChange } = await handleFindDifferences()

    if (!hasChange) return

    const changeIsCurrent = changes.find(
      (c) => PathsCorrespondingTo[c] === pathname
    )

    // if the change is the current path, update the current state, refresh and return
    if (changeIsCurrent) {
      currentState.current = newState
      router.refresh()

      return
    }

    // if the change is not the current path
    // add the changes to the pending refreshes if they are not already there
    changes.forEach((changed) => {
      if (!pendingRefreshes.current.includes(changed))
        pendingRefreshes.current.push(changed)
    })

    const pendingIsCurrent = pendingRefreshes.current.find(
      (p) => PathsCorrespondingTo[p] === pathname
    )

    // remove the pending refresh if the refresh was performed on the pending path
    if (pendingIsCurrent) {
      removePending(pendingIsCurrent)
      router.refresh()
    }

    return
  }

  // get and set the current state every 10 seconds if the new state is different
  useEffect(() => {
    // get the initial state
    handleFindDifferences()
      .then(({ newState }) => {
        currentState.current = newState
      })
      .catch((err) =>
        console.error('Error getting initial state:', err?.message)
      )

    // set the interval to get the state every 10 seconds
    const interval = setInterval(() => {
      handle().catch((err) =>
        console.error('Error handling state update:', err?.message)
      )
    }, 10_000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

// Helper function to find the differences between two objects
function findDifferences<T extends object>(obj1: T, obj2: T) {
  return (Object.keys(obj1) as (keyof T)[]).filter(
    (k) => !isEqual(obj1[k], obj2[k])
  )
}
