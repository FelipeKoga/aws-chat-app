import { APIGatewayProxyResult } from 'aws-lambda';

export const formatResponse = ({ statusCode, body }): APIGatewayProxyResult => ({
    statusCode,
    body: JSON.stringify(body),
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
});
