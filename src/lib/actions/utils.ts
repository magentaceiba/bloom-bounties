'use server'

import { createPublicClient, http } from 'viem'
import { getWorkflow } from '../getWorkflow'
import { optimismSepolia } from '../constants/chains'

const defaultOrchestratorAddress = process.env
  .NEXT_PUBLIC_ORCHESTRATOR_ADDRESS as `0x${string}` | undefined

if (!defaultOrchestratorAddress)
  throw new Error('NEXT_PUBLIC_ORCHESTRATOR_ADDRESS is required')

const publicClient = createPublicClient({
  chain: optimismSepolia,
  transport: http(),
})

export const getServerWorkflow = () =>
  getWorkflow(publicClient as any, defaultOrchestratorAddress)
