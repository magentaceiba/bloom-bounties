'use server'

import {
  PathState,
  PathStatePostRequest,
  PathsCorrespondingTo,
} from '@/lib/types/revalidate'
import { CalledFrom, serverActionWrapper } from '../utils/serverActionWrapper'
import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'
import { revalidatePath } from 'next/cache'

const stateCache = new CacheContainer(new MemoryStorage())

const initialState: PathState = {
  bounties: 0,
  verify: 0,
  claims: 0,
}

export async function postPathState(text: PathStatePostRequest) {
  const cachedState = await stateCache.getItem<PathState>('state')

  const newCachedState: PathState = cachedState ?? initialState

  switch (text) {
    case 'bounties':
      newCachedState.bounties++
      break
    case 'verify':
      newCachedState.verify++
      break
    case 'claims':
      newCachedState.claims++
    default:
      throw new Error('Invalid request text')
  }

  await stateCache.setItem('state', newCachedState, { isCachedForever: true })
}

export async function getPathState<C extends CalledFrom>(calledFrom: C) {
  return await serverActionWrapper(async () => {
    return (await stateCache.getItem<PathState>('state')) ?? initialState
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
