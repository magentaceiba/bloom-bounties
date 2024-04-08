import { sepolia as org } from 'viem/chains'

const INFURA_API_KEY = process.env.INFURA_API_KEY

export const sepolia = {
  ...org,
  ...(!!INFURA_API_KEY && {
    rpcUrls: {
      default: {
        http: [`https://sepolia.infura.io/v3/${INFURA_API_KEY}`],
      },
    },
  }),
}
