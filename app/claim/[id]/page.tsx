import { ClientClaimPage } from './client'

type Props = {
  params: { id: string }
}

export default async function ClaimPage({ params }: Props) {
  const { id } = params
  return <ClientClaimPage id={id} />
}
