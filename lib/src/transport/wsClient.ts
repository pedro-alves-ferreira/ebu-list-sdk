import SocketIOClient from 'socket.io-client';
import logger from '../utils/logger';

// ////////////////////////////////////////////////////////////////////////////

function handleWsError(error: any): void {
    logger.error(`WebSocket error: ${error}`);
}

function handleWsConnectError(error: any): void {
    logger.error(`WebSocket connection error: ${error}`);
}
export default class WSCLient {
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

        this.client.on('error', handleWsError);
        this.client.on('connect_error', handleWsConnectError);
    }

    public close(): void {
        this.client.off('error', handleWsError);
        this.client.off('connect_error', handleWsConnectError);
        this.client.close();
    }
}
