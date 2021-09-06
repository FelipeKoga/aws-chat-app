import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { container } from 'tsyringe';
import { DynamoConstants } from './constants';
import {
    GetItemRequest, PutItemRequest, QueryOptions, QueryRequest,
} from './types';

class DynamoProvider {
    private client: DocumentClient;

    constructor() {
        this.client = new DocumentClient();
    }

    async query<Response>(params: QueryRequest, options: QueryOptions): Promise<Response[]> {
        const response = await this.client.query({
            ...params,
            TableName: DynamoConstants.TableName,
            IndexName: options.userSortKeyIndex ? DynamoConstants.Indexes.sortKey : undefined,
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
        } catch {
            return false;
        }
    }

    async get<Response>(key: GetItemRequest): Promise<Response> {
        const response = await this.client.get({
            Key: key,
            TableName: DynamoConstants.TableName,
        }).promise();

        return response.Item as Response;
    }
}

container.registerSingleton<DynamoProvider>(
    'DynamoProvider', DynamoProvider,
);

export default DynamoProvider;
