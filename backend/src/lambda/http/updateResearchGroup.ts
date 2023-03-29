import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils';

import { updateResearchGroup } from '../../businessLogic/researchGroup'
import { UpdateResearchGroupRequest } from '../../requests/UpdateResearchGroupRequest'
// import { getUserId } from '../utils'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const researchGroupId = event.pathParameters.researchGroupId
        const updatedResearchGroup: UpdateResearchGroupRequest = JSON.parse(event.body)
        // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
        await updateResearchGroup(researchGroupId,getUserId(event), updatedResearchGroup)
        return {
            statusCode: 202,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(updatedResearchGroup)
        }
    }
)

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
