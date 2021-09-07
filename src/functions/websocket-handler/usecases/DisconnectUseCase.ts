import { IUseCase } from '@shared/utils/IUseCase';
import { inject, injectable } from 'tsyringe';
import type { IWebSocketRepository } from '../repository/IWebSocketRepository';

interface IDisconnectUseCasePayload {
    connectionId: string;
}

@injectable()
class DisconnectUseCase implements IUseCase<IDisconnectUseCasePayload, void> {
    constructor(
        @inject('WebSocketRepository')
        private webSocketRepository: IWebSocketRepository,
    ) { }

    async invoke(payload: IDisconnectUseCasePayload): Promise<void> {
        const email = await this.webSocketRepository.getEmailByConnectionId(payload.connectionId);

        await this.webSocketRepository.disconnect(
            payload.connectionId,
            email,
        );
    }
}

export { DisconnectUseCase };
