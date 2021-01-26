import decode from 'jwt-decode';

const tokenRevalidateAdvanceMs = 30000;

interface IDecodedToken {
    exp: number; // Expiration time in UNIX time (s)
    iat: number; // Issued time in UNIX time (s)
    id: string;
    username: string;
}

function isDecodedToken(v: IDecodedToken | unknown): v is IDecodedToken {
    return (v as IDecodedToken).iat !== undefined;
}

const decodeToken = (token: string): IDecodedToken | undefined => {
    try {
        const decoded = decode(token);
        if (isDecodedToken(decoded)) {
            return decoded;
        }
    } catch (err) {
        console.error(`Error decoding token: ${err}`);
        return undefined;
    }
};

export interface ILocalStorageHandler {
    setItem: (key: string, value: any) => void;
    getItem: (key: string) => any | undefined;
    removeItem: (key: string) => void;
}

export interface ILoginData {
    username: string;
    password: string;
}

export interface ILoginResponse {
    success: boolean;
    token: string;
}

export interface IGenericResponse<ContentType> {
    desc: string;
    result: number;
    content: ContentType;
}

export interface IApiHandler {
    login: (data: ILoginData) => Promise<IGenericResponse<ILoginResponse>>;
    revalidateToken: (token: string) => Promise<IGenericResponse<ILoginResponse>>;
}

export class AuthClient {
    private readonly tokenLocalStorageKey = 'bearer-token';
    private revalidateTimer: NodeJS.Timeout | null;

    public constructor(
        private readonly apiHandler: IApiHandler,
        private readonly storageHandler: ILocalStorageHandler
    ) {
        this.revalidateTimer = null;
    }

    public close() {
        this.clearTimer();
    }

    public async login(username: string, password: string): Promise<void | Error> {
        try {
            const response = await this.apiHandler.login({ username, password });

            if (response && response.result <= 0 && response.content.success) {
                this.setToken(response.content.token);
            }

            return;
        } catch (err) {
            this.invalidateToken();
            return err;
        }
    }

    public revalidate(): void {
        const token = this.getToken();
        if (token) {
            // If this is a browser refresh, try to revalidate the token
            this.handleRevalidateTimer();
        }
    }

    public logout() {
        this.storageHandler.removeItem(this.tokenLocalStorageKey);
    }

    public getToken(): string {
        const t = this.storageHandler.getItem(this.tokenLocalStorageKey);
        return t;
    }

    // Checks if token is valid
    public isAuthenticated(): boolean {
        const token = this.getToken();
        return token !== undefined;
    }

    ////////////////////
    // Private

    private setToken(token: string): void {
        this.storageHandler.setItem(this.tokenLocalStorageKey, token);

        const decoded = decodeToken(token);
        if (decoded === undefined) {
            console.error('Invalid token');
            this.invalidateToken();
            return;
        }

        const expireInMs = (decoded.exp - decoded.iat) * 1000; // Convert to ms delta

        const revalidateTime =
            expireInMs > tokenRevalidateAdvanceMs ? expireInMs - tokenRevalidateAdvanceMs : expireInMs / 2;
        // console.log(`Token expires in ${expireInMs}ms. Setting the timer to fire in ${revalidateTime}ms`);
        this.resetTimer(revalidateTime);
    }

    private invalidateToken(): void {
        this.storageHandler.removeItem(this.tokenLocalStorageKey);
    }

    private clearTimer(): void {
        if (this.revalidateTimer !== null) {
            clearTimeout(this.revalidateTimer);
            this.revalidateTimer = null;
        }
    }

    private resetTimer(deltaMs: number): void {
        this.clearTimer();
        this.revalidateTimer = setTimeout(() => this.handleRevalidateTimer(), deltaMs);
    }

    private async handleRevalidateTimer() {
        try {
            const response = await this.apiHandler.revalidateToken(this.getToken());
            if (response && response.result <= 0 && response.content.success) {
                this.setToken(response.content.token);
            }

            return;
        } catch (err) {
            console.error(`Token revalidation error ${JSON.stringify(err)}`);
        }

        this.invalidateToken();
    }
}
