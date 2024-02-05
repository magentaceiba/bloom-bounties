import { type Hex } from 'viem'
import { Workflow } from './getWorkflow'

const BountyRoles = {
  Claimer: 'CLAIMANT_ROLE',
  Verifier: 'VERIFIER_ROLE',
  Issuer: 'BOUNTY_ISSUER_ROLE',
} as const

export type BountyRoleKeys = keyof typeof BountyRoles

const Roles = {
  Owner: 'ORCHESTRATOR_OWNER_ROLE',
  ...BountyRoles,
} as const

export type RoleKeys = keyof typeof Roles

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
  const roleIds = {} as Record<RoleKeys, Hex>

  for (const [key, value] of Object.entries(BountyRoles)) {
    const id = await logic.read[value]()

    roleIds[key as RoleKeys] = id
  }

  const OwnerRoleId = await authorizer.read.getOwnerRole()
  roleIds.Owner = OwnerRoleId

  let generatedRoles = {} as Record<BountyRoleKeys, Hex>

  for (const [role, id] of Object.entries(roleIds)) {
    const generatedRole = await authorizer.read.generateRoleId([
      logicAddress,
      id!,
    ])

    generatedRoles[role as BountyRoleKeys] = generatedRole!
  }
  // ===========GENERATION_DONE===========

  let hasRoles = {} as Record<`is${RoleKeys}`, boolean>

  for (const key of Object.keys(Roles) as RoleKeys[]) {
    let res: boolean
    res = await authorizer.read.hasRole([
      { ...generatedRoles, Owner: roleIds.Owner }[key],
      address!,
    ])
    hasRoles[`is${key}`] = res
  }

  return { ...hasRoles, roleIds, generatedRoles }
}
