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
  address: '0xdbEdA5eD0d488f892C747217aF9f86091F5Ec4A7',
  abi: ERC20Mock_ABI,
  client: { public: publicClient, wallet: walletClient },
})

const mintMockERC20 = (walletAddress: `0x${string}`, amount: number) =>
  ERC20MockContract.write.mint([walletAddress, parseUnits(String(amount), 18)])

describe('Mint Mock ERC20', () => {
  it(
    'should mint the specified amount of tokens to the first address in the wallet',
    async () => {
      const res = await mintMockERC20(walletClientAddresses, 10_000_000)
      expect(res).pass()
      console.log('Mint ERC20 Tx Hash: ', res)
    },
    {
      timeout: 100_000,
    }
  )
})
