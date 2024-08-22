'use server'

import { handleBountyList } from '../handleBountyList'
import { getServerWorkflow } from './utils'

export async function getList() {
  const workflow = await getServerWorkflow()
  const ids =
    await workflow.optionalModule.LM_PC_Bounties_v1.read.listBountyIds.run()
  const list = await handleBountyList(workflow, ids)
  return list
}
