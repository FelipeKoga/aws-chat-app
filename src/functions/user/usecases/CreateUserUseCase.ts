import { IUseCase } from '@shared/IUseCase';
import User from '@shared/models/User';
import { inject, injectable } from 'tsyringe';
import { GetUserUseCase } from './GetUserUseCase';
import { UnknowError, UserAlreadyExists } from '../../../shared/errors';
import type { IUserRepository } from '../repository/IUserRepository';

interface ICreateUserPayload {
    name: string;
    email: string;
    password: string;
}
@injectable()
class CreateUserUseCase implements IUseCase<ICreateUserPayload, User> {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,

        @inject('GetUserUseCase')
        private getUserUseCase: GetUserUseCase,
    ) { }

    async invoke(payload: ICreateUserPayload): Promise<User> {
        const foundUser: User | null = await this.getUserUseCase
            .invoke({ email: payload.email })
            .catch(() => null);

        if (foundUser) {
            throw new UserAlreadyExists('User already exists.');
        }

        const hasCreated = await this.userRepository.create(
            new User({ ...payload }),
        );

        if (!hasCreated) {
            throw new UnknowError('Error when registering the user.');
        }

        return this.getUserUseCase.invoke({ email: payload.email });
    }
}

export { CreateUserUseCase };
