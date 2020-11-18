import SocketIOClient from 'socket.io-client';
import { logger } from '../logger';

//////////////////////////////////////////////////////////////////////////////

export class WSCLient {
    public readonly client: SocketIOClient.Socket;

    public constructor(url: string, path: string, userId: string) {
        this.client = (null as unknown) as SocketIOClient.Socket;
        this.client = SocketIOClient(url, {
            autoConnect: true,
            path,
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionDelayMax: 2000,
            rejectUnauthorized: false,
            transports: ['websocket', 'polling'],
        });
    
        this.client.on('connect', () => {
            this.client.emit('register', userId);
        });
    
        this.client.on('error', this.handleWsError);
        this.client.on('connect_error', this.handleWsConnectError);
    }

    public close(): void {
        this.client.off('error', this.handleWsError);
        this.client.off('connect_error', this.handleWsConnectError);
        this.client.close();
    }

    // // Returns a promise which resolves to:
    // // - the event, if succeeded
    // // - undefined, if timeout
    // public makeAwaiter<TResponse>(
    //     eventName: string,
    //     condition: (data: any) => TResponse | false,
    //     timeoutMs: number
    // ): Promise<TResponse | undefined> {
    //     return makeAwaiter(this.client, eventName, condition, timeoutMs);
    // }

    private handleWsError(error: any): void {
        logger.error(`WebSocket error: ${error}`);
    }

    private handleWsConnectError(error: any): void {
        logger.error(`WebSocket connection error: ${error}`);
    }
}

// // Returns a promise which resolves to:
// // - the value returned by condition, if succeeded
// // - undefined, if timeout
// // condition should return a truthy value to indicate that the event is accepted.
// export function makeAwaiter<TResponse>(
//     ws: SocketIOClient.Socket,
//     eventName: string,
//     condition: (data: any) => TResponse | false,
//     timeoutMs: number
// ): Promise<TResponse | undefined> {
//     return new Promise((resolve, reject) => {
//         const timer = setTimeout(() => {
//             ws.off('message', callback);
//             console.error('awaiter timed out');
//             resolve(undefined);
//         }, timeoutMs);

//         const callback = (msg: IWSMessage) => {
//             //process.stdout.write(`event: ${JSON.stringify(msg)}\n`);
//             return undefined;
//             // if (msg.event !== eventName) {
//             //     return;
//             // }
//             // const result = condition(msg.data);
//             // if (result) {
//             //     clearTimeout(timer);
//             //     ws.off('message', callback);
//             //     resolve(result);
//             // }
//         };

//         ws.on('message', callback);
//     });
// }
