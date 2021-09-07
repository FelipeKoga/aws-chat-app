import { IUseCase } from '@shared/utils/IUseCase';
import { inject, injectable } from 'tsyringe';
import type { IWebSocketRepository } from '../repository/IWebSocketRepository';

type PostMessageUseCasePayload = {
    emails: string[];
    data: any;
}

@injectable()
class PostMessageUseCase implements IUseCase<PostMessageUseCasePayload, void> {
    constructor(
        @inject('WebSocketRepository')
        private webSocketRepository: IWebSocketRepository,
    ) { }

    async invoke({ emails, data }: PostMessageUseCasePayload): Promise<void> {
        await this.webSocketRepository.postMessage(emails, data);
    }
}

export { PostMessageUseCase };
