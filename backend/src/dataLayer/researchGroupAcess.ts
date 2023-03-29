import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { ResearchGroupItem } from '../models/ResearchGroupItem'
import { ResearchGroupUpdate } from '../models/ResearchGroupUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class ResearchGroupAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly researchGroupTable = process.env.RESEARCH_GROUP_TABLE) {
  }

  async deleteResearchGroupById(researchGroupId: string, userId: string) {
    await this.docClient.delete({
      TableName: this.researchGroupTable,
      Key: {
        'researchGroupId': researchGroupId,
        'userId': userId
      }
    }).promise()
  }

  async updateResearchGroup(researchGroupId: string, userId: string, updatedResearchGroup: ResearchGroupUpdate){

    await this.docClient.update({
        TableName: this.researchGroupTable,
        Key: {
            "researchGroupId": researchGroupId,
            "userId": userId
        },
        UpdateExpression: "set #name = :name, description = :description",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":name": updatedResearchGroup.name,
            ":description": updatedResearchGroup.description
        }
    }).promise()
}

  async getResearchGroupByUserId(userId: string): Promise<ResearchGroupItem[]> {
    const result = await this.docClient.query({
      TableName: this.researchGroupTable,
      IndexName: 'userIdGSI',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
    const items = result.Items
    return items as ResearchGroupItem[]
  }

  async createResearchGroup(researchGroup: ResearchGroupItem): Promise<ResearchGroupItem> {
    await this.docClient.put({
      TableName: this.researchGroupTable,
      Item: researchGroup
    }).promise()

    return researchGroup
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
