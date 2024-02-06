import { revalidatePath } from 'next/cache'
import { CalledFrom, serverActionWrapper } from '../utils/serverActionWrapper'
import { createPublicClient, http } from 'viem'
import { goerli } from 'viem/chains'
import { getWorkflow } from '../getWorkflow'

export async function revalidateServerPaths<C extends CalledFrom>(
  calledFrom: C,
  path: string[]
) {
  return await serverActionWrapper(async () => {
    for (const p of path) {
      revalidatePath(p)
    }

    return 'Successfully revalidated path'
  }, calledFrom)
}

const defaultOrchestratorAddress = process.env
  .NEXT_PUBLIC_ORCHESTRATOR_ADDRESS as `0x${string}` | undefined

const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
})

export const getServerWorkflow = () =>
  getWorkflow(publicClient, defaultOrchestratorAddress!)
