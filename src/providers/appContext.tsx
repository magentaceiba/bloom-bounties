'use client'

import useIsHydratedHandler from '@/hooks/useIsHydratedHandler'
import { createContext, useContext } from 'react'
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
  const isHydrated = useIsHydratedHandler()
  const workflow = useWorkflowHandler()

  // CONTEXT
  //==============================================
  const contextData: TAppContext = {
    isHydrated,
    workflow,
  }

  // RETURN
  //==============================================
  return (
    <AppContext.Provider value={contextData}>{children}</AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
