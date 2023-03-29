import { apiEndpoint } from '../config'
import { ResearchGroup } from '../types/ResearchGroup';
import { CreateResearchGroupRequest } from '../types/CreateResearchGroupRequest';
import Axios from 'axios'
import { UpdateResearchGroupRequest } from '../types/UpdateResearchGroupRequest';

export async function getResearchGroups(idToken: string): Promise<ResearchGroup[]> {
  console.log('Fetching research groups')

  const response = await Axios.get(`${apiEndpoint}/research-groups`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('ResearchGroup:', response.data)
  return response.data.items
}

export async function createResearchGroup(
  idToken: string,
  newResearchGroup: CreateResearchGroupRequest
): Promise<ResearchGroup> {
  const response = await Axios.post(`${apiEndpoint}/research-groups`,  JSON.stringify(newResearchGroup), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.newItem
}

export async function patchResearchGroup(
  idToken: string,
  researchGroupId: string,
  updatedResearchGroup: UpdateResearchGroupRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/research-groups/${researchGroupId}`, JSON.stringify(updatedResearchGroup), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteResearchGroup(
  idToken: string,
  researchGroupId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/research-groups/${researchGroupId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  researchGroupId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/research-groups/${researchGroupId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
