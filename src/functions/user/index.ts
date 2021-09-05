import User from '@shared/models/User';
import 'reflect-metadata';
import './di/module';

import { container } from 'tsyringe';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CreateUserUseCase, GetUserUseCase } from './usecases';

const createUser = async (body: string): Promise<APIGatewayProxyResult> => {
    const { email, name } = JSON.parse(body);

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = new User({ email, name });

    await createUserUseCase.invoke(user);

    return {
        statusCode: 201,
        body: JSON.stringify(user),
    };
};

const getUser = async ({ email }): Promise<APIGatewayProxyResult> => {
    const getUserUseCase = container.resolve(GetUserUseCase);

    const user = await getUserUseCase.invoke({ email });

    return {
        statusCode: 200,
        body: JSON.stringify(user),
    };
};

export const handle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    switch (event.httpMethod) {
    case 'POST': return createUser(event.body);
    case 'GET': return getUser(event.pathParameters as { email: string });

    default: throw new Error('Method not allowed');
    }
};
