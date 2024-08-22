'use server'

import { handleBountyList } from '../handleBountyList'
import { handleClaimList } from '../handleClaimList'
import { getServerWorkflow } from './utils'

export async function getList() {
  const workflow = await getServerWorkflow()
  const ids =
    await workflow.optionalModule.LM_PC_Bounties_v1.read.listClaimIds.run()
  const list = await handleClaimList(workflow, ids)
  return list
}

export async function get(id: number | string) {
  const workflow = await getServerWorkflow()
  const claim = (await handleBountyList(workflow, [String(id)]))[0]
  return claim
}
