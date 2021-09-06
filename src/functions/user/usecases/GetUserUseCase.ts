import { IUseCase } from '@shared/utils/IUseCase';
import User from '@shared/models/User';
import { inject, injectable } from 'tsyringe';
import { NotFound } from '../../../shared/errors';
import type { IUserRepository } from '../repository/IUserRepository';

interface IGetUserUseCasePayload {
    email: string;
}

@injectable()
class GetUserUseCase implements IUseCase<IGetUserUseCasePayload, User> {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,
    ) { }

    async invoke(payload: IGetUserUseCasePayload): Promise<User> {
        const user = await this.userRepository.get(payload.email);

        if (!user) {
            throw new NotFound('User not found');
        }

        return user;
    }
}

export { GetUserUseCase };
