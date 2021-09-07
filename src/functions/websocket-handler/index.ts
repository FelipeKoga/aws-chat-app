import 'reflect-metadata';
import './di';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatResponse } from '@shared/utils/apiGatewayResponse';
import { container } from 'tsyringe';
import { BaseError } from '../../shared/errors';
import { ConnectUseCase } from './usecases/ConnectUseCase';
import { DisconnectUseCase } from './usecases/DisconnectUseCase';
import { PostMessageUseCase } from './usecases/PostMessageUseCase';

type WebSocketHandlerEvent = APIGatewayProxyEvent & {
    isPostMessageRequest: boolean
}

const connect = async ({ connectionId, connectedAt, token }): Promise<APIGatewayProxyResult> => {
    const connectUseCase = container.resolve(ConnectUseCase);

    await connectUseCase.invoke({ connectionId, connectedAt, token });

    return formatResponse({ statusCode: 200, body: 'connected' });
};

const disconnect = async ({ connectionId }): Promise<APIGatewayProxyResult> => {
    const disconnectUseCase = container.resolve(DisconnectUseCase);

    await disconnectUseCase.invoke({ connectionId });

    return formatResponse({ statusCode: 200, body: 'disconnected' });
};

const postMessage = async ({ emails, data }) : Promise<APIGatewayProxyResult> => {
    const postMessageUseCase = container.resolve(PostMessageUseCase);

    await postMessageUseCase.invoke({ emails, data });

    return formatResponse({ statusCode: 200, body: 'sent' });
};

export const handle = async (
    {
        requestContext, queryStringParameters, body, isPostMessageRequest,
    }: WebSocketHandlerEvent,
): Promise<APIGatewayProxyResult> => {
    try {
        let response: APIGatewayProxyResult;

        const { eventType, connectionId, connectedAt } = requestContext;

        if (eventType === 'CONNECT') {
            response = await connect({
                connectionId,
                connectedAt,
                token: queryStringParameters.token,
            });
        }

        if (eventType === 'DISCONNECT') {
            response = await disconnect({ connectionId });
        }

        if (isPostMessageRequest && body) {
            response = await postMessage(JSON.parse(body));
        }

        if (!response) {
            throw new Error('Method not allowed');
        }

        return response;
    } catch (exception) {
        if (exception instanceof BaseError) {
            const { statusCode, code, message } = exception;

            return formatResponse({
                statusCode,
                body: {
                    code,
                    message,
                },
            });
        }

        return exception;
    }
};
