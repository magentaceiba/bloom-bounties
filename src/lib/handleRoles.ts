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

type RoleHexs = Record<RoleKeys, Hex>
type GeneratedRoles = Record<BountyRoleKeys, Hex>

export const getRoleHexes = async ({
  workflow: { authorizer, logicModule },
}: Omit<HandleRoleProps, 'address'>) => {
  const logicAddress = logicModule.address
  // Initialize roleIds and generatedRoles as empty objects
  const roleHexs = {} as RoleHexs
  const generatedRoles = {} as GeneratedRoles

  // Set role HEXs for each role in BountyRoles
  for (const [key, value] of Object.entries(BountyRoles)) {
    roleHexs[key as BountyRoleKeys] = await logicModule.read[value].run()
  }

  // Generate role IDs for each role in roleHexs
  for (const [role, id] of Object.entries(roleHexs) as [
    BountyRoleKeys,
    Hex,
  ][]) {
    generatedRoles[role] = await authorizer.read.generateRoleId.run([
      logicAddress,
      id!,
    ])
  }

  // Add the owner role HEX to roleHexs
  roleHexs.Owner = await authorizer.read.getOwnerRole.run()

  return { roleHexs, generatedRoles }
}

export const getHasRoles = async ({
  workflow: { authorizer },
  address,
  roleHexs,
  generatedRoles,
}: {
  workflow: Workflow
  roleHexs: RoleHexs
  generatedRoles: GeneratedRoles
  address: Hex
}) => {
  // Initialize hasRoles as an empty object
  const hasRoles = {} as Record<`is${RoleKeys}`, boolean>

  // Check if the address has each role in Roles
  for (const key of Object.keys(Roles) as RoleKeys[]) {
    hasRoles[`is${key}`] = await authorizer.read.hasRole.run([
      { Owner: roleHexs.Owner, ...generatedRoles }[key],
      address,
    ])
  }

  // Return the results
  return hasRoles
}

export const handleRoles = async ({ workflow, address }: HandleRoleProps) => {
  console.log('HANDLING ROLES')
  // Initialize roleIds and generatedRoles as empty objects
  const { roleHexs, generatedRoles } = await getRoleHexes({
    workflow,
  })

  const hasRoles = await getHasRoles({
    roleHexs,
    generatedRoles,
    workflow,
    address,
  })

  // Return the results
  return { ...hasRoles, roleHexs, generatedRoles }
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
  roleHexs: RoleHexs
}) => {
  // Determine the action based on the role and type
  const action = `${type === 'Grant' ? 'grant' : 'revoke'}${
    role === 'Owner' ? 'Role' : 'ModuleRole'
  }` as const

  const args = [roleHexs[role], walletAddress] as const

  let hash: Hex

  if (action === 'grantRole' || action === 'revokeRole')
    hash = await workflow.authorizer.write[action].run(args)
  else hash = await workflow.logicModule.write[action].run(args)

  return hash
}
