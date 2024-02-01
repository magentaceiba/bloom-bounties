'use server'

import { handleBountyList } from '../handleBountyList'
import { handleClaimList } from '../handleClaimList'
import { getServerWorkflow } from './utils'

export async function getList() {
  const workflow = await getServerWorkflow()
  const ids = await workflow.contracts.logic.read.listClaimIds()
  const list = await handleClaimList(workflow, ids)
  return list
}

export async function get(id: number | string) {
  const workflow = await getServerWorkflow()
  const claim = (await handleBountyList(workflow, [BigInt(id)]))[0]
  return claim
}
