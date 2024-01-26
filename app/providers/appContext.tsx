'use client'

import useIsHydrated from '@/hooks/useIsHydrated'
import { setThemeCookie } from '@/lib/utils'
import { createContext, useContext, useEffect } from 'react'
import { useTheme } from '@/providers'

export type TAppContext = {
  isHydrated: boolean
}

const AppContext = createContext({} as TAppContext)

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme } = useTheme()
  const isHydrated = useIsHydrated()

  // CONTEXT
  //==============================================
  const contextData: TAppContext = {
    isHydrated,
  }

  // EFFECTS
  //==============================================
  useEffect(() => {
    setThemeCookie(theme)
  }, [theme])
  // RETURN
  //==============================================
  return (
    <AppContext.Provider value={contextData}>{children}</AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
