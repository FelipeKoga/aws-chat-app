import ApiGatewayManagementApi from 'aws-sdk/clients/apigatewaymanagementapi';
import { container } from 'tsyringe';

export type PostMessagePayload = {
    connectionId: string;
    data: any;
}

class APIGatewayProvider {
    private apigwManagementApi: ApiGatewayManagementApi;

    constructor() {
        this.apigwManagementApi = new ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: process.env.WS_URL,
        });
    }

    async postMessage({ connectionId, data }: PostMessagePayload): Promise<void> {
        await this.apigwManagementApi
            .postToConnection({
                ConnectionId: connectionId,
                Data: JSON.stringify({ ...data }),
            })
            .promise();
    }
}

container.registerSingleton<APIGatewayProvider>(
    'APIGatewayProvider', APIGatewayProvider,
);

export { APIGatewayProvider };
