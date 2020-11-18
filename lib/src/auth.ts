import { post, validateResponseCode } from './transport/common';
import * as types from './types';

//////////////////////////////////////////////////////////////////////////////

export const login = async (options: types.IListOptions): Promise<string> => {
    const data: object = {
        password: options.password,
        username: options.username,
    };

    const response = await post(options.baseUrl, null, '/auth/login', data);
    validateResponseCode(response);

    const success = response?.content?.success;
    if (success !== true) {
        throw new Error(`Failed to login: ${JSON.stringify(response)}`);
    }

    return response?.content?.token;
};
