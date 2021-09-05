import { DynamoConstants, DynamoProvider } from '@shared/dynamo';
import User from '@shared/models/User';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../IUserRepository';

@injectable()
class UserRepositoryImpl implements IUserRepository {
    constructor(@inject('DynamoProvider') private dynamoResolver: DynamoProvider) { }

    get(email: string): Promise<User> {
        return this.dynamoResolver.get<User>({
            pk: DynamoConstants.Keys.userPartitionKey + email,
            sk: DynamoConstants.Keys.config,
        });
    }

    create(user: User): Promise<boolean> {
        return this.dynamoResolver.create({
            ...user,
            pk: DynamoConstants.Keys.userPartitionKey + user.email,
            sk: DynamoConstants.Keys.config,
        });
    }
}

export { UserRepositoryImpl };
