import { useAppContext, useThemeContext } from '@/providers'

export { default as useDisclosure } from './useDisclosure'
export { default as useDeposit } from './useDeposit'
export { default as useServerAction } from './useServerAction'

export const useIsHydrated = () => useAppContext().isHydrated
export const useWorkflow = () => useAppContext().workflow
export const useToast = () => useThemeContext().toastHandler
export const useTheme = () => useThemeContext().themeHandler
export { useInputFocus } from './useInputFocus'
export * from './useRole'
export * from './useWorkflowHandler'
