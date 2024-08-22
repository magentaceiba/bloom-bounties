import { optimismSepolia as org } from 'viem/chains'

const INFURA_API_KEY = process.env.INFURA_API_KEY

export const optimismSepolia = {
  ...org,
  ...(!!INFURA_API_KEY && {
    rpcUrls: {
      default: {
        http: [`https://optimism-sepolia.infura.io/v3/${INFURA_API_KEY}`],
      },
    },
  }),
}
