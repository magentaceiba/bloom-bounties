import { expect, describe, it } from 'bun:test'
import testConnectors from './testConnectors'
import { getContract, parseUnits } from 'viem'
import { ERC20Mock_ABI } from './ERC20Mock_ABI'

// Top Level Contract Address ORCHESTRATOR_ADDRESS
const orchestratorAddress = <`0x${string}`>(
  process.env.NEXT_PUBLIC_ORCHESTRATOR_ADDRESS
)
if (!orchestratorAddress) throw new Error('ORCHESTRATOR_ADDRESS is required')

const { walletClient, publicClient } = testConnectors()

const walletAddress = process.env.TEST_WALLET_ADDRESS as
  | `0x${string}`
  | undefined

// Addresses of the wallet client
const walletClientAddresses = walletAddress ?? walletClient.account.address

// Create ERC20Mock contract / this is a mock contract for testing purposes
const ERC20MockContract = getContract({
  address: '0xFb4DC4067900C3e5b37eD0476c9c866864e0C759',
  abi: ERC20Mock_ABI,
  publicClient,
  walletClient,
})

const mintMockERC20 = (walletAddress: `0x${string}`, amount: number) =>
  ERC20MockContract.write.mint([walletAddress, parseUnits(String(amount), 18)])

describe('Mint Mock ERC20', () => {
  it('should mint the specified amount of tokens to the first address in the wallet', async () => {
    const res = await mintMockERC20(walletClientAddresses, 10_000_000)
    expect(res).pass()
    console.log('Mint ERC20 Tx Hash: ', res)
  })
})
