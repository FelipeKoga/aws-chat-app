import { container } from 'tsyringe';
import { WebSocketRepository } from '../repository/impl/WebSocketRepository';
import { IWebSocketRepository } from '../repository/IWebSocketRepository';

container.registerSingleton<IWebSocketRepository>(
    'WebSocketRepository', WebSocketRepository,
);
