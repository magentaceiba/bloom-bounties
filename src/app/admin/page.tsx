'use client'

import NoAccess from '@/components/ui/NoAccess'
import { useRole } from '@/hooks'
import { useEffect, useMemo, useState } from 'react'
import { Tabs, TextInput } from '@/components/ui'
import { Alert, Button, Form, Loading, Toggle } from 'react-daisyui'
import { isAddress, type Hex } from 'viem'
import { WalletWidget } from '@/components'
import cn from 'classnames'

const tabs = ['Owner', 'Claimer', 'Issuer', 'Verifier'] as const
type Tabs = (typeof tabs)[number]

export default function AdminPage() {
  const { roles, setRole, isConnected, checkRole } = useRole()
  const [tab, setTab] = useState(0)
  const [walletAddress, setWalletAddress] = useState('')
  const [type, setType] = useState<'Grant' | 'Revoke'>('Grant')

  const toggleType = () => {
    setType((prev) => (prev === 'Grant' ? 'Revoke' : 'Grant'))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRole.mutate({
      type,
      role: tabs[tab],
      walletAddress: walletAddress as Hex,
    })
  }

  const canSubmit = useMemo(() => {
    const role = tabs[tab]
    let can = checkRole?.data?.[`is${role}`] ?? false
    let message = `User ${can ? 'has' : 'does not have'} role ${role}`
    if (type === 'Grant') can = !can
    return { can, message }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkRole.data, tab, type])

  useEffect(() => {
    checkRole.mutate(walletAddress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress])

  if (!isConnected) return <WalletWidget />

  if (roles.isPending) return <Loading />

  if (!roles.data?.isOwner) return <NoAccess />

  return (
    <>
      <div className="flex items-center gap-6">
        <h2>Manage Role</h2>
        <Form
          className="bg-base-200 px-1 rounded-lg shadow"
          onChange={toggleType}
        >
          <Form.Label title={type}>
            <Toggle className="ml-3" />
          </Form.Label>
        </Form>
      </div>
      <Tabs
        variant="boxed"
        setTab={setTab}
        tab={tab}
        tabs={tabs as unknown as string[]}
      />
      <form className="flex flex-col w-full max-w-xl gap-3" onSubmit={onSubmit}>
        <TextInput
          label="Wallet Address"
          onChange={setWalletAddress}
          type="address"
          required
        />
        <Alert
          className={cn(
            (checkRole.isPending ||
              checkRole.isError ||
              !isAddress(walletAddress)) &&
              'hidden'
          )}
        >
          {canSubmit.message}
        </Alert>
        <Button
          size={'sm'}
          color="primary"
          type="submit"
          disabled={setRole.isPending || checkRole.isPending || !canSubmit?.can}
          loading={setRole.isPending || checkRole.isPending}
        >
          Set Role
        </Button>
      </form>
    </>
  )
}
