import { IUseCase } from '@shared/utils/IUseCase';
import { verifyCognitoToken } from '@functions/websocket-handler/utils/verifyCognitoToken';
import { inject, injectable } from 'tsyringe';
import type { IWebSocketRepository } from '../repository/IWebSocketRepository';

type ConnectUseCasePayload = {
    connectionId: string;
    connectedAt: number;
    token: string;
}

@injectable()
class ConnectUseCase implements IUseCase<ConnectUseCasePayload, void> {
    constructor(
        @inject('WebSocketRepository')
        private webSocketRepository: IWebSocketRepository,
    ) { }

    async invoke({ token, connectionId, connectedAt }: ConnectUseCasePayload): Promise<void> {
        const username = await verifyCognitoToken(token);

        await this.webSocketRepository.connect(
            connectionId,
            connectedAt,
            username,
        );
    }
}

export { ConnectUseCase };
