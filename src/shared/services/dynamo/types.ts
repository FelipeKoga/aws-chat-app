import * as DynamoDB from 'aws-sdk/clients/dynamodb';

export type QueryOptions = {
    userSortKeyIndex?: boolean;
}

export type QueryRequest = Omit<DynamoDB.DocumentClient.QueryInput, 'TableName' | 'IndexName'>;

export type PutItemRequest= { pk: string, sk: string, [item: string]: any };

export type ItemRequest = { pk: string, sk: string }
