import { UnknowError } from '@shared/errors';
import axios from 'axios';

import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';

import jwkToPem from 'jwk-to-pem';

const JWKS_URL = `https://cognito-idp.us-east-1.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`;

type JWKSKey = {
    kid: string;
    alg: jsonwebtoken.Algorithm;
    n: string;
    e: string;
    kty: 'RSA';
}

const decodeTokenHeader = (token: string): { kid: string, alg: string } => {
    const [headerEncoded] = token.split('.');
    const decoded = Buffer.from(headerEncoded, 'base64').toString('ascii');
    return JSON.parse(decoded);
};

const getJwksKeys = async () => {
    const rawRes = await axios(JWKS_URL);

    const response = await rawRes.data as { keys: [JWKSKey]};

    if (rawRes.status !== 200) throw new UnknowError('Internal server error');

    return response.keys;
};

export const verifyCognitoToken = async (token: string) => {
    const header = decodeTokenHeader(token);

    const keys = await getJwksKeys();

    const foundKey = keys.find((key) => key.kid === header.kid);

    if (!foundKey) throw new Error('Unauthorized');

    const pem = jwkToPem(foundKey);

    const jsonValues = jsonwebtoken.verify(token, pem,
        { algorithms: [foundKey.alg] }) as JwtPayload;

    if (jsonValues.client_id !== process.env.USER_POOL_CLIENT_ID) {
        throw new Error('Unauthorized');
    }

    return jsonValues.username;
};
