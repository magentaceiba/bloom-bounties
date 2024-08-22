import { optimism as org } from 'viem/chains'

const INFURA_API_KEY = process.env.INFURA_API_KEY

export const optimism = {
  ...org,
  ...(!!INFURA_API_KEY && {
    rpcUrls: {
      default: {
        http: [`https://optimism-mainnet.infura.io/v3/${INFURA_API_KEY}`],
      },
    },
  }),
}
