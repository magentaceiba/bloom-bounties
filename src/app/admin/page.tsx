'use client'

import NoAccess from '@/components/ui/NoAccess'
import { useRole } from '@/hooks'
import { Loading } from 'react-daisyui'

export default function AdminPage() {
  const roles = useRole()

  if (roles.isPending) return <Loading />

  if (!roles.data?.isOwner) return <NoAccess />

  return (
    <div>
      <h1>AdminPage</h1>
    </div>
  )
}
