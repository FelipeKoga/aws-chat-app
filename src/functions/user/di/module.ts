import { container } from 'tsyringe';
import { UserRepositoryImpl } from '../repository/impl/UserRepositoryImpl';
import { IUserRepository } from '../repository/IUserRepository';
import { GetUserUseCase } from '../usecases';

container.registerSingleton<IUserRepository>(
    'UserRepository', UserRepositoryImpl,
);

container.registerSingleton<GetUserUseCase>(
    'GetUserUseCase', GetUserUseCase,
);
