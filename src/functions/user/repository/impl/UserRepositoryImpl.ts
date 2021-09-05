import { DynamoConstants, DynamoProvider } from '@shared/dynamo';
import User from '@shared/models/User';
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
    constructor(@inject('DynamoProvider') private dynamoResolver: DynamoProvider) { }

    get(email: string): Promise<User> {
        return this.dynamoResolver.get<User>(getUserKeys(email));
    }

    create(user: User): Promise<boolean> {
        return this.dynamoResolver.create({
            ...user,
            ...getUserKeys(user.email),
        });
    }
}

export { UserRepositoryImpl };
