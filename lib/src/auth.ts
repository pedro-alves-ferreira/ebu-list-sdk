import _ from 'lodash';
import { post, validateResponseCode } from './common';

//////////////////////////////////////////////////////////////////////////////

export const login = async (baseUrl: string, username: string, password: string): Promise<string> => {
    const data: object = {
        password,
        username,
    };

    const response = await post(baseUrl, null, '/auth/login', data);
    validateResponseCode(response);

    const success = _.get(response, 'content.success');
    if (success !== true) { throw new Error(`Failed to login: ${JSON.stringify(response)}`); }

    const token = _.get(response, 'content.token');
    return token;
}

export const logout = async (baseUrl: string, token: string): Promise<any> => {
    const response = await post(baseUrl, token, '/auth/logout', {});
    return validateResponseCode(response);
}
