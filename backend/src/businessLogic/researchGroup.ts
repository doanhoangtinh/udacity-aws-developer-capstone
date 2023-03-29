import { ResearchGroupAccess } from '../dataLayer/researchGroupAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { ResearchGroupItem } from '../models/ResearchGroupItem'
import { CreateResearchGroupRequest } from '../requests/CreateResearchGroupRequest'
import { UpdateResearchGroupRequest } from '../requests/UpdateResearchGroupRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
// TODO: Implement businessLogic
// TODO: Implement businessLogic

const researchGroupAccess = new ResearchGroupAccess()
const attachmentUtils = new AttachmentUtils()


export async function getResearchGroupByUserId(userId: string): Promise<ResearchGroupItem[]> {
  return researchGroupAccess.getResearchGroupByUserId(userId)
}

export async function deleteResearchGroupById(researchGroupId: string, userId: string) {
  researchGroupAccess.deleteResearchGroupById(researchGroupId, userId)
}

export async function updateResearchGroup(researchGroupId: string, userId: string, updateResearchGroup: UpdateResearchGroupRequest) {
  researchGroupAccess.updateResearchGroup(researchGroupId, userId, updateResearchGroup)
}

export async function createResearchGroup(
  createResearchGroupRequest: CreateResearchGroupRequest,
  jwtToken: string
): Promise<ResearchGroupItem> {

  const itemId = uuid.v4()

  return await researchGroupAccess.createResearchGroup({
    researchGroupId: itemId,
    createdAt: new Date().toISOString(),
    name: createResearchGroupRequest.name,
    description: createResearchGroupRequest.description,
    attachmentUrl: await attachmentUtils.createAttachmentURL(itemId),
    userId: jwtToken
  })
}