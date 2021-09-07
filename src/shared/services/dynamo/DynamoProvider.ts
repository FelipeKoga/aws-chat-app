import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { container } from 'tsyringe';
import { DynamoConstants } from './constants';
import {
    ItemRequest, PutItemRequest, QueryOptions, QueryRequest,
} from './types';

export function extractValueFromKey(key: string): string {
    return key.split('#')[1];
}
class DynamoProvider {
    private client: DocumentClient;

    constructor() {
        this.client = new DocumentClient();
    }

    async query<Response>(params: QueryRequest, options?: QueryOptions): Promise<Response[]> {
        const response = await this.client.query({
            ...params,
            TableName: DynamoConstants.TableName,
            KeyConditionExpression: options?.userSortKeyIndex
                ? DynamoConstants.Query.bySortKey
                : DynamoConstants.Query.byPartitionKey,
            IndexName: options?.userSortKeyIndex
                ? DynamoConstants.Indexes.sortKey
                : undefined,
        }).promise();

        return response.Items as Response[];
    }

    async create(data: PutItemRequest): Promise<boolean> {
        try {
            await this.client.put({
                Item: { ...data },
                TableName: DynamoConstants.TableName,
            }).promise();

            return true;
        } catch (e) {
            return false;
        }
    }

    async get<Response>(key: ItemRequest): Promise<Response> {
        const response = await this.client.get({
            Key: key,
            TableName: DynamoConstants.TableName,
        }).promise();

        return response.Item as Response;
    }

    async delete(key: ItemRequest): Promise<boolean> {
        try {
            await this.client.delete({
                TableName: DynamoConstants.TableName,
                Key: key,
            }).promise();

            return true;
        } catch (e) {
            return false;
        }
    }
}

container.registerSingleton<DynamoProvider>(
    'DynamoProvider', DynamoProvider,
);

export default DynamoProvider;
