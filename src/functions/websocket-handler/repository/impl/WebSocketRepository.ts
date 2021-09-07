import { DynamoConstants, DynamoProvider } from '@shared/services/dynamo';
import { extractValueFromKey } from '@shared/services/dynamo/DynamoProvider';
import { inject, injectable } from 'tsyringe';
import type{ IWebSocketRepository } from '../IWebSocketRepository';

@injectable()
class WebSocketRepository implements IWebSocketRepository {
    constructor(
        @inject('DynamoProvider') private dynamoProvider: DynamoProvider,
    ) { }

    async connect(connectionId: string, connectedAt: number, email: string): Promise<void> {
        await this.dynamoProvider.create({
            pk: DynamoConstants.Keys.userPartitionKey + email,
            sk: DynamoConstants.Keys.connection + connectionId,
            connectionId,
            connectedAt,
        });
    }

    async disconnect(connectionId: string, email: string): Promise<void> {
        await this.dynamoProvider.delete({
            pk: DynamoConstants.Keys.userPartitionKey + email,
            sk: DynamoConstants.Keys.connection + connectionId,
        });
    }

    async getEmailByConnectionId(connectionId: string): Promise<string> {
        const response = await this.dynamoProvider.query({
            ExpressionAttributeValues: {
                ':sk': DynamoConstants.Keys.connection + connectionId,
                ':pk': DynamoConstants.Keys.userPartitionKey,
            },
        }, { userSortKeyIndex: true });

        if (response.length) {
            return extractValueFromKey((response[0] as { pk: string}).pk);
        }

        return null;
    }

    postMessage(): Promise<void> {
        // TODO: send websocket message
    }
}

export { WebSocketRepository };
