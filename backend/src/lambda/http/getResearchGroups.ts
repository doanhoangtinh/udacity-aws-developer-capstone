import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getResearchGroupByUserId } from '../../businessLogic/researchGroup'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    // console.log(event)
    console.log(getUserId(event))
    const researchGroups = await getResearchGroupByUserId(getUserId(event))
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items: researchGroups
      })
    }
  })
handler.use(
  cors({
    credentials: true
  })
)
