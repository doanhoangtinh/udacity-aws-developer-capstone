import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
// import * as uuid from 'uuid'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

export class AttachmentUtils {

    constructor(
        // private readonly doc Client: DocumentClient = createDynamoDBClient(),
        // private readonly todosTable = process.env.TODOS_TABLE,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) { }


    async createAttachmentURL(researchGroupId: string) {
        // var attachmentId = uuid.v4()
        var imageUrl = `https://${this.bucketName}.s3.amazonaws.com/${researchGroupId}`
        return imageUrl
    }

    getAttachmentUrl(researchGroupId: string) {
        return s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: researchGroupId,
            Expires: this.urlExpiration
        })
    }
}
