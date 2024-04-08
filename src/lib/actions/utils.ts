'use server'

import { createPublicClient, http } from 'viem'
import { getWorkflow } from '../getWorkflow'
import { sepolia } from '../constants/chains'

const defaultOrchestratorAddress = process.env
  .NEXT_PUBLIC_ORCHESTRATOR_ADDRESS as `0x${string}` | undefined

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})

export const getServerWorkflow = () =>
  getWorkflow(publicClient, defaultOrchestratorAddress!)
