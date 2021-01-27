import { ILocalStorageHandler } from './auth';

export default class TokenStorage implements ILocalStorageHandler {
    public token: string | undefined = undefined;

    public setItem(key: string, value: string): void {
        this.token = value;
    }

    public getItem(key: string): string | undefined {
        return this.token;
    }

    public removeItem(key: string): void {
        this.token = undefined;
    }
}
