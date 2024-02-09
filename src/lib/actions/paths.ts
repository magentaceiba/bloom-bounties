'use server'

import {
  PathState,
  PathStatePostRequest,
  PathsCorrespondingTo,
  initialPathsState,
} from '@/lib/types/paths'
import { CalledFrom, serverActionWrapper } from '../utils/serverActionWrapper'
import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'
import { revalidatePath } from 'next/cache'

const stateCache = new CacheContainer(new MemoryStorage())

export async function postPathState(text: PathStatePostRequest) {
  const cachedState = await stateCache.getItem<PathState>('state')

  const newCachedState: PathState = cachedState ?? initialPathsState

  if (!newCachedState[text]) throw new Error('Invalid request text')

  newCachedState[text]++

  await stateCache.setItem('state', newCachedState, { isCachedForever: true })
}

export async function getPathState<C extends CalledFrom>(calledFrom: C) {
  return await serverActionWrapper(async () => {
    return (await stateCache.getItem<PathState>('state')) ?? initialPathsState
  }, calledFrom)
}

export async function revalidateServerPaths<C extends CalledFrom>(
  calledFrom: C,
  path: PathStatePostRequest[]
) {
  return await serverActionWrapper(async () => {
    for (let p of path) {
      revalidatePath(PathsCorrespondingTo[p], 'page')
      postPathState(p)
    }

    return 'Successfully revalidated path'
  }, calledFrom)
}
