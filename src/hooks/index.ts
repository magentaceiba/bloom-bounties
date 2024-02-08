import { useAppContext, useThemeContext } from '@/providers'

export { default as useDisclosure } from './useDisclosure'
export { default as useServerAction } from './useServerAction'
export { default as useRevalidateServerPaths } from './useRevalidateServerPaths'

export const useIsHydrated = () => useAppContext().isHydrated
export const useWorkflow = () => useAppContext().workflow
export const useToast = () => useThemeContext().toastHandler
export const useTheme = () => useThemeContext().themeHandler
export * from './useRole'
export * from './useWorkflowHandler'
