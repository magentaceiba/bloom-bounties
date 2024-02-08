'use server'

import { createPublicClient, http } from 'viem'
import { goerli } from 'viem/chains'
import { getWorkflow } from '../getWorkflow'

const defaultOrchestratorAddress = process.env
  .NEXT_PUBLIC_ORCHESTRATOR_ADDRESS as `0x${string}` | undefined

const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
})

export const getServerWorkflow = () =>
  getWorkflow(publicClient, defaultOrchestratorAddress!)
