import { IUseCase } from '@shared/IUseCase';
import User from '@shared/models/User';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../repository/IUserRepository';

interface ICreateUserPayload {
    name: string;
    email: string;
}

@injectable()
class CreateUserUseCase implements IUseCase<ICreateUserPayload, User> {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,
    ) { }

    async invoke(payload: ICreateUserPayload): Promise<User> {
        const foundUser = await this.userRepository.get(payload.email);

        if (foundUser) {
            throw new Error('User already exists.');
        }

        const hasCreated = this.userRepository.create(payload);

        if (!hasCreated) {
            throw new Error('Error inserting the user.');
        }

        return this.userRepository.get(payload.email);
    }
}

export { CreateUserUseCase };
