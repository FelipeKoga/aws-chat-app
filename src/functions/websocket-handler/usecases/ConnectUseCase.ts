import { IUseCase } from '@shared/utils/IUseCase';
import { verifyCognitoToken } from '@functions/websocket-handler/utils/verifyCognitoToken';
import { inject, injectable } from 'tsyringe';
import type { IWebSocketRepository } from '../repository/IWebSocketRepository';

interface IConnectUseCasePayload {
    connectionId: string;
    connectedAt: number;
    token: string;
}

@injectable()
class ConnectUseCase implements IUseCase<IConnectUseCasePayload, void> {
    constructor(
        @inject('WebSocketRepository')
        private webSocketRepository: IWebSocketRepository,
    ) { }

    async invoke(payload: IConnectUseCasePayload): Promise<void> {
        const { token, connectionId, connectedAt } = payload;
        const username = await verifyCognitoToken(token);

        await this.webSocketRepository.connect(
            connectionId,
            connectedAt,
            username,
        );
    }
}

export { ConnectUseCase };
