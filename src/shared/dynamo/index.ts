import { container } from 'tsyringe';
import { DynamoConstants } from './constants';
import DynamoProvider from './DynamoProvider';

container.registerSingleton<DynamoProvider>(
    'DynamoProvider', DynamoProvider,
);

export { DynamoProvider, DynamoConstants };
