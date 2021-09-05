import User from '@shared/models/User';
import 'reflect-metadata';
import './di/module';

import { container } from 'tsyringe';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatResponse } from '@shared/apiGatewayResponse';
import { CreateUserUseCase, GetUserUseCase } from './usecases';
import { BaseError } from './errors';

const createUser = async (body: string): Promise<APIGatewayProxyResult> => {
    const { email, name } = JSON.parse(body);

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = new User({ email, name });

    await createUserUseCase.invoke(user);

    return formatResponse({ statusCode: 201, body: user });
};

const getUser = async ({ email }): Promise<APIGatewayProxyResult> => {
    const getUserUseCase = container.resolve(GetUserUseCase);

    const user = await getUserUseCase.invoke({ email });

    return formatResponse({ statusCode: 200, body: user });
};

export const handle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        let response: APIGatewayProxyResult;

        if (event.httpMethod === 'POST') {
            response = await createUser(event.body);
        }

        if (event.httpMethod === 'GET') {
            response = await getUser(event.pathParameters as { email: string });
        }

        return response;
    } catch (exception) {
        if (exception instanceof BaseError) {
            const { statusCode, name, message } = exception;

            return formatResponse({
                statusCode,
                body: {
                    name,
                    message,
                },
            });
        }

        return exception;
    }
};
