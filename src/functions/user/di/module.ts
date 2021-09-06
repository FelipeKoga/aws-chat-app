import { container } from 'tsyringe';
import { UserRepository } from '../repository/impl/UserRepository';
import { IUserRepository } from '../repository/IUserRepository';
import { GetUserUseCase } from '../usecases';

container.registerSingleton<IUserRepository>(
    'UserRepository', UserRepository,
);

container.registerSingleton<GetUserUseCase>(
    'GetUserUseCase', GetUserUseCase,
);
