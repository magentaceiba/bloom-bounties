import { formatUnits } from 'viem'
import { useWorkflow } from '.'
import { useQuery } from '@tanstack/react-query'

export default function useFundingStats() {
  const workflow = useWorkflow()
  const address = workflow.data?.addresses.funding
  const decimals = workflow.data?.ERC20Decimals
  const symbol = workflow.data?.ERC20Symbol ?? '...'

  const totalSupply = useQuery({
    queryKey: ['totalSupply', address],
    queryFn: async () => {
      const value = await workflow.data!.contracts.funding.read.totalSupply()
      const formatted = formatUnits(value, decimals!)
      return {
        value,
        formatted,
      }
    },
    enabled: workflow.isSuccess,
  })

  const isPending = totalSupply.isPending

  return {
    isPending,
    totalSupply: {
      ...totalSupply.data,
    },
    symbol,
  }
}
