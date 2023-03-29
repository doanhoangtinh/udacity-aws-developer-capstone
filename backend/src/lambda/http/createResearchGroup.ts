import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateResearchGroupRequest } from '../../requests/CreateResearchGroupRequest'
import { getUserId } from '../utils';
import { createResearchGroup } from '../../businessLogic/researchGroup'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newResearchGroup: CreateResearchGroupRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    console.log('Processing event: ', event)
    const newItem = await createResearchGroup(newResearchGroup, getUserId(event))

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem
      })
    }
  }
)


handler.use(
  cors({
    credentials: true
  })
)
