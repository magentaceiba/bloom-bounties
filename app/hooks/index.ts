import { useAppContext } from '@/providers'

export { default as useDisclosure } from './useDisclosure'
export { default as useToastHandler } from './useToastHandler'
export { default as useDeposit } from './useDeposit'

export const useIsHydrated = () => useAppContext().isHydrated
