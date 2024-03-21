import { createPublicClient, createWalletClient, defineChain, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import type { PublicClient, WalletClient } from 'wagmi'

export default function testConnectors(): {
  publicClient: PublicClient
  walletClient: WalletClient
} {
  // Public Client: This is used to read from the blockchain.
  const publicClient = createPublicClient({
    chain: goerli,
    transport: http(),
  })

  // Private Key for high level operations
  // ( ex// Bloom Multisig, in this exemple this is a single private key )
  const ownerPrivateKey = <`0x${string}`>process.env.TEST_PRIVATE_KEY
  if (!ownerPrivateKey) throw new Error('PRIVATE_KEY is required')

  // Owner Wallet Client: This is only for demonstration purposes.
  // You should pass a window.ethereum instance in production or development enviroments.
  // Using JSON-RPC Accounts // https://viem.sh/docs/clients/wallet.html#json-rpc-accounts
  // This is used to write to the blockchain.

  // NOTE, this is named the owner client because it has access to all modules ex// assign Role, cancel, ext
  // If need not be for it, non-owner can be used for deposits.
  const walletClient = createWalletClient({
    account: privateKeyToAccount(ownerPrivateKey),
    chain: goerli,
    transport: http(),
  })

  return {
    publicClient,
    walletClient,
  }
}

export const goerli = /*#__PURE__*/ defineChain({
  id: 5,
  network: 'goerli',
  name: 'Goerli',
  nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    alchemy: {
      http: ['https://eth-goerli.g.alchemy.com/v2'],
      webSocket: ['wss://eth-goerli.g.alchemy.com/v2'],
    },
    infura: {
      http: ['https://goerli.infura.io/v3'],
      webSocket: ['wss://goerli.infura.io/ws/v3'],
    },
    default: {
      http: ['https://goerli.gateway.tenderly.co'],
    },
    public: {
      http: ['https://goerli.gateway.tenderly.co'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Etherscan',
      url: 'https://goerli.etherscan.io',
    },
    default: {
      name: 'Etherscan',
      url: 'https://goerli.etherscan.io',
    },
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensUniversalResolver: {
      address: '0x56522D00C410a43BFfDF00a9A569489297385790',
      blockCreated: 8765204,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 6507670,
    },
  },
  testnet: true,
})
