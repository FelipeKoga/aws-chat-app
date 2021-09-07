import { IUseCase } from '@shared/utils/IUseCase';
import { inject, injectable } from 'tsyringe';
import type { IWebSocketRepository } from '../repository/IWebSocketRepository';

type DisconnectUseCasePayload = {
    connectionId: string;
}

@injectable()
class DisconnectUseCase implements IUseCase<DisconnectUseCasePayload, void> {
    constructor(
        @inject('WebSocketRepository')
        private webSocketRepository: IWebSocketRepository,
    ) { }

    async invoke({ connectionId }: DisconnectUseCasePayload): Promise<void> {
        const email = await this.webSocketRepository.getEmailByConnectionId(connectionId);

        await this.webSocketRepository.disconnect(
            connectionId,
            email,
        );
    }
}

export { DisconnectUseCase };
