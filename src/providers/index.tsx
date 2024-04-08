'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReduxProvider from '../lib/store/ReduxProvider'
import ConnectorProvider from './ConnectorProvider'
import AppProvider from './appContext'
import ThemeProvider from './themeContext'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
    },
  },
})

console.log('RENDER AT PROVIDERS')

export default function Providers({
  children,
  theme,
}: {
  children: React.ReactNode
  theme: 'light' | 'dark'
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider>
        <ThemeProvider initialTheme={theme}>
          <ConnectorProvider>
            <AppProvider>
              {/* STYLE PROVIDERS AND CHILDREN */}
              {children}
            </AppProvider>
          </ConnectorProvider>
        </ThemeProvider>
      </ReduxProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export * from './appContext'
export * from './themeContext'
