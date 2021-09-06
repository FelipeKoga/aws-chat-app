import { container, injectable } from 'tsyringe';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';

@injectable()
class CognitoProvider {
    private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;

    constructor() {
        this.cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
    }

    async create({ email, password, name }) {
        await this.cognitoIdentityServiceProvider.adminCreateUser({
            UserPoolId: process.env.USER_POOL_ID,
            Username: email,
            TemporaryPassword: password,
            MessageAction: 'SUPPRESS',
            UserAttributes: [
                {
                    Name: 'name',
                    Value: name,
                },
                {
                    Name: 'email',
                    Value: email,
                },
                {
                    Name: 'email_verified',
                    Value: 'true',
                },
            ],
        }).promise();

        return this.cognitoIdentityServiceProvider.adminSetUserPassword({
            UserPoolId: process.env.USER_POOL_ID,
            Username: email,
            Password: password,
            Permanent: true,
        }).promise();
    }
}

container.registerSingleton<CognitoProvider>(
    'CognitoProvider', CognitoProvider,
);

export { CognitoProvider };
