import User from '@shared/models/User';

interface IUserRepository {

    get(email: string): Promise<User>

    create(user: User): Promise<boolean>
}

export { IUserRepository };
