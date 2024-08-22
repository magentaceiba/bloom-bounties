import { useWorkflow } from '.'
import { useQuery } from '@tanstack/react-query'

export default function useFundingStats() {
  const workflow = useWorkflow()
  const address = workflow.data?.fundingManager.address
  const symbol = workflow.data?.fundingToken.symbol ?? '...'

  const totalSupply = useQuery({
    queryKey: ['totalSupply', address],
    queryFn: async () => {
      const formatted =
        await workflow.data!.fundingToken.module.read.balanceOf.run(
          workflow.data?.fundingManager.address!
        )
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
