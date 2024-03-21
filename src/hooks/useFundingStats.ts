import { useWorkflow } from '.'
import { useQuery } from '@tanstack/react-query'

export default function useFundingStats() {
  const workflow = useWorkflow()
  const address = workflow.data?.fundingManager.address
  const symbol = workflow.data?.erc20Symbol ?? '...'

  const totalSupply = useQuery({
    queryKey: ['totalSupply', address],
    queryFn: async () => {
      const formatted =
        await workflow.data!.fundingManager.read.totalSupply.run()
      return formatted
    },
    enabled: workflow.isSuccess,
  })

  const isPending = totalSupply.isPending

  return {
    isPending,
    totalSupply: totalSupply.data,
    symbol,
  }
}
