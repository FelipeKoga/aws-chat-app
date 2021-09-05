import { IUseCase } from '@shared/IUseCase';
import User from '@shared/models/User';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../repository/IUserRepository';

interface IGetUserUseCase {
    email: string;
}

@injectable()
class GetUserUseCase implements IUseCase<IGetUserUseCase, User> {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,
    ) { }

    async invoke(payload: IGetUserUseCase): Promise<User> {
        return this.userRepository.get(payload.email);
    }
}

export { GetUserUseCase };
