'use client'

import { Global } from '@emotion/react'
import { getDynamicTheme } from '@/styles/dynamicTheme'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { MagicEvmWalletConnectors } from '@dynamic-labs/magic'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { WagmiProvider, createConfig, http } from 'wagmi'
import type { HttpTransport } from 'viem'
import { useTheme } from '@/hooks'
import { useMemo } from 'react'
import { sepolia } from '@/lib/constants/chains'

const chains = [sepolia] as const

export default function ConnectorProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme } = useTheme()
  const { cssOverrides, shadowDomOverWrites } = useMemo(
    () => getDynamicTheme(theme === 'light'),
    [theme]
  )

  console.log('FIRE AT CONNECTOR PROVIDER')

  const config = useMemo(
    () =>
      createConfig({
        chains: chains,
        multiInjectedProviderDiscovery: false,
        transports: chains.reduce(
          (acc, chain) => {
            acc[chain.id] = http()
            return acc
          },
          {} as Record<number, HttpTransport>
        ),
        ssr: true,
      }),
    []
  )

  // RENDER
  return (
    <>
      <Global styles={shadowDomOverWrites} />
      <DynamicContextProvider
        settings={{
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ID || '',
          cssOverrides,
          walletConnectors: [
            EthereumWalletConnectors,
            MagicEvmWalletConnectors,
          ],
        }}
      >
        <WagmiProvider config={config}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </WagmiProvider>
      </DynamicContextProvider>
    </>
  )
}
