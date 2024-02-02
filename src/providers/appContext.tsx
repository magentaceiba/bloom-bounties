'use client'

import useIsHydratedHandler from '@/hooks/useIsHydratedHandler'
import { setThemeCookie } from '@/lib/utils'
import { createContext, useContext, useEffect } from 'react'
import { useTheme } from '@/hooks'
import { useInputFocusHandler } from '@/hooks/useInputFocus'
import useWorkflowHandler from '@/hooks/useWorkflowHandler'

export type TAppContext = {
  isHydrated: boolean
  inputFocus: ReturnType<typeof useInputFocusHandler>
  workflow: ReturnType<typeof useWorkflowHandler>
}

const AppContext = createContext({} as TAppContext)

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme } = useTheme()
  const isHydrated = useIsHydratedHandler()
  const inputFocus = useInputFocusHandler()
  const workflow = useWorkflowHandler()

  // CONTEXT
  //==============================================
  const contextData: TAppContext = {
    isHydrated,
    inputFocus,
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
