import { APIGatewayProvider } from '@functions/websocket-handler/services/APIGatewayProvider';
import { DynamoConstants, DynamoProvider } from '@shared/services/dynamo';
import { extractValueFromKey } from '@shared/services/dynamo/DynamoProvider';
import { inject, injectable } from 'tsyringe';
import type{ IWebSocketRepository } from '../IWebSocketRepository';

@injectable()
class WebSocketRepository implements IWebSocketRepository {
    constructor(
        @inject('DynamoProvider') private dynamoProvider: DynamoProvider,
        @inject('APIGatewayProvider') private apiGatewayProvider: APIGatewayProvider,
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

    async postMessage(emails: string[], data: any): Promise<void> {
        const connectionIds = await this.getUsersConnectionIds(emails);

        const requests = [];

        connectionIds.forEach((connectionId: string) => {
            requests.push(this.apiGatewayProvider.postMessage({ connectionId, data }));
        });

        await Promise.all(requests);
    }

    private async getUsersConnectionIds(emails: string[]): Promise<string[]> {
        const requests = [];

        emails.forEach((email) => {
            requests.push(this.getConnectionIdByEmail(email));
        });

        const response = await Promise.all(requests);

        return response.reduce((acc, curr) => [...acc, ...curr], []);
    }

    private async getConnectionIdByEmail(email: string): Promise<string[]> {
        const response = await this.dynamoProvider.query({
            ExpressionAttributeValues: {
                ':pk': DynamoConstants.Keys.userPartitionKey + email,
                ':sk': DynamoConstants.Keys.connection,
            },
        });

        if (response.length) {
            return response.map(({ connectionId }) => connectionId);
        }

        return [];
    }
}

export { WebSocketRepository };
