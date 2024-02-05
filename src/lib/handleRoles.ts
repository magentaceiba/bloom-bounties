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
  // Initialize roleIds and generatedRoles as empty objects
  const roleHexs = {} as Record<RoleKeys, Hex>
  const generatedRoles = {} as Record<BountyRoleKeys, Hex>

  // Set role HEXs for each role in BountyRoles
  for (const [key, value] of Object.entries(BountyRoles)) {
    roleHexs[key as BountyRoleKeys] = await logic.read[value]()
  }

  // Generate role IDs for each role in roleHexs
  for (const [role, id] of Object.entries(roleHexs) as [
    BountyRoleKeys,
    Hex,
  ][]) {
    generatedRoles[role] = await authorizer.read.generateRoleId([
      logicAddress,
      id!,
    ])
  }

  // Add the owner role HEX to roleHexs
  roleHexs.Owner = await authorizer.read.getOwnerRole()

  // Initialize hasRoles as an empty object
  const hasRoles = {} as Record<`is${RoleKeys}`, boolean>

  // Check if the address has each role in Roles
  for (const key of Object.keys(Roles) as RoleKeys[]) {
    hasRoles[`is${key}`] = await authorizer.read.hasRole([
      { Owner: roleHexs.Owner, ...generatedRoles }[key],
      address,
    ])
  }

  // Return the results
  return { ...hasRoles, roleHexs }
}

export const grantOrRevokeRole = async ({
  role,
  walletAddress,
  type,
  workflow,
  roleHexs,
}: {
  role: RoleKeys
  walletAddress: Hex
  type: 'Grant' | 'Revoke'
  workflow: Workflow
  roleHexs: Record<RoleKeys, Hex>
}) => {
  // Determine the action based on the role and type
  const action = `${type === 'Grant' ? 'grant' : 'revoke'}${
    role === 'Owner' ? 'Role' : 'ModuleRole'
  }` as const

  const args = [roleHexs[role], walletAddress] as const

  let hash: Hex

  if (action === 'grantRole' || action === 'revokeRole')
    hash = await workflow.contracts.authorizer.write[action](args)
  else hash = await workflow.contracts.logic.write[action](args)

  return hash
}
