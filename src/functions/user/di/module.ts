import { container } from 'tsyringe';
import { UserRepositoryImpl } from '../repository/impl/UserRepositoryImpl';
import { IUserRepository } from '../repository/IUserRepository';

container.registerSingleton<IUserRepository>(
    'UserRepository', UserRepositoryImpl,
);
