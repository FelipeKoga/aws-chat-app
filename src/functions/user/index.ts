import { APIGatewayProxyResult } from "aws-lambda";

export const handle = async (): Promise<APIGatewayProxyResult> => {

    return {
        statusCode: 200,
        body: 'Ok!'
    }
}