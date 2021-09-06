import { DynamoConstants, DynamoProvider } from '@shared/services/dynamo';
import User from '@shared/models/User';
import { CognitoProvider } from '@shared/services/cognito/CognitoProvider';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../IUserRepository';

function getUserKeys(email: string): { pk: string, sk: string } {
    return {
        pk: DynamoConstants.Keys.userPartitionKey + email,
        sk: DynamoConstants.Keys.config,
    };
}
@injectable()
class UserRepositoryImpl implements IUserRepository {
    constructor(
        @inject('DynamoProvider') private dynamoProvider: DynamoProvider,
        @inject('CognitoProvider') private cognitoProvider: CognitoProvider,
    ) { }

    get(email: string): Promise<User> {
        return this.dynamoProvider.get<User>(getUserKeys(email));
    }

    async create(user: User): Promise<boolean> {
        const {
            email, password, name, ...values
        } = user;

        await this.cognitoProvider.create({ email, password, name });

        return this.dynamoProvider.create({
            ...getUserKeys(email),
            ...values,
            email,
            name,
            registeredAt: Date.now(),
        });
    }
}

export { UserRepositoryImpl };
