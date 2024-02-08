'use client'

import useIsHydratedHandler from '@/hooks/useIsHydratedHandler'
import { setThemeCookie } from '@/lib/utils'
import { createContext, useContext, useEffect } from 'react'
import { useTheme } from '@/hooks'
import useWorkflowHandler from '@/hooks/useWorkflowHandler'
import useHandleClientPathState from '@/hooks/useRefreshServerPaths'

export type TAppContext = {
  isHydrated: boolean
  workflow: ReturnType<typeof useWorkflowHandler>
}

const AppContext = createContext({} as TAppContext)

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useHandleClientPathState()
  const { theme } = useTheme()
  const isHydrated = useIsHydratedHandler()
  const workflow = useWorkflowHandler()

  // CONTEXT
  //==============================================
  const contextData: TAppContext = {
    isHydrated,
    workflow,
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
