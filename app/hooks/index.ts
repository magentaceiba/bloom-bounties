import { useAppContext, useThemeContext } from '@/providers'

export { default as useDisclosure } from './useDisclosure'
export { default as useDeposit } from './useDeposit'

export const useIsHydrated = () => useAppContext().isHydrated
export const useToast = () => useThemeContext().toastHandler
export const useTheme = () => useThemeContext().themeHandler
export { useInputFocus } from './useInputFocus'
