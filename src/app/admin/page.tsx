'use client'

import NoAccess from '@/components/ui/NoAccess'
import { useRole } from '@/hooks'
import { useState } from 'react'
import { Tabs, TextInput } from '@/components/ui'
import { Button, Form, Loading, Toggle } from 'react-daisyui'
import { type Hex } from 'viem'

const tabs = ['Owner', 'Claimer', 'Issuer', 'Verifier'] as const
type Tabs = (typeof tabs)[number]

export default function AdminPage() {
  const { roles, setRole } = useRole()
  const [tab, setTab] = useState(0)
  const [walletAddress, setWalletAddress] = useState('')
  const [type, setType] = useState<'Grant' | 'Revoke'>('Grant')

  const toggleType = () => {
    setType((prev) => (prev === 'Grant' ? 'Revoke' : 'Grant'))
  }

  if (roles.isPending) return <Loading />

  if (!roles.data?.isOwner) return <NoAccess />

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRole.mutate({
      type,
      role: tabs[tab],
      walletAddress: walletAddress as Hex,
    })
  }

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
      <form className="flex flex-col w-full max-w-xl" onSubmit={onSubmit}>
        <TextInput
          label="Wallet Address"
          onChange={setWalletAddress}
          type="address"
          required
        />
        <Button size={'sm'} color="primary" type="submit" className="mt-3">
          Set Role
        </Button>
      </form>
    </>
  )
}
