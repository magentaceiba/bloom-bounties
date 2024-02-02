import { type Hex } from 'viem'
import { Workflow } from './getWorkflow'

const BountyRoles = {
  Claimer: 'CLAIMANT_ROLE',
  Verifier: 'VERIFIER_ROLE',
  Issuer: 'BOUNTY_ISSUER_ROLE',
} as const

const Roles = {
  Owner: 'ORCHESTRATOR_OWNER_ROLE',
  ...BountyRoles,
} as const

type RoleKeys = keyof typeof Roles

export type HandleRoleProps = {
  workflow: Workflow
  address: Hex
}

export const handleRoles = async ({
  workflow: {
    contracts: { authorizer, logic },
    addresses: { logic: logicAddress },
  },
  address,
}: HandleRoleProps) => {
  // ===========GENERATION_START===========
  const bountyRoleIds = await Promise.all(
    Object.entries(BountyRoles).map(async ([key, value]) => {
      const id = await logic.read[value]()
      return { id, role: key as RoleKeys }
    })
  )

  let generatedRoles = {} as Record<RoleKeys, Hex>

  for (const { id, role } of bountyRoleIds) {
    const generatedRole = await authorizer.read.generateRoleId([
      logicAddress,
      id!,
    ])

    generatedRoles[role] = generatedRole!
  }

  generatedRoles.Owner = await authorizer.read.getOwnerRole()!
  // ===========GENERATION_DONE===========

  let hasRoles = {} as Record<`is${RoleKeys}`, boolean>

  for (const key of Object.keys(Roles) as RoleKeys[]) {
    const res = await authorizer.read.hasRole([generatedRoles[key], address!])
    hasRoles[`is${key}`] = res
  }

  return hasRoles
}
