'use server'

import { handleBountyList } from '../handleBountyList'
import { getServerWorkflow } from './utils'

export async function getList() {
  const workflow = await getServerWorkflow()
  const ids = await workflow.contracts.logic.read.listBountyIds()
  const list = await handleBountyList(workflow, ids)
  return list
}
