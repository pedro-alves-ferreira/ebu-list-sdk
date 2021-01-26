import { types } from '@bisect/ebu-list-sdk';

export const preprocessorRequestQueue = {
    name: 'ebu-list.preprocessor.request',
    options: {
        durable: true,
    },
};

export const preprocessorStatusExchange = {
    name: 'ebu-list.preprocessor.status',
    type: 'fanout',
    options: { durable: false },
    keys: ['announce'],
};

export enum Actions {
    request = 'preprocessing.request',
}

export interface IRequestMessage {
    action: 'preprocessing.request';
    workflow_id: string; // the workflow identifier
    pcap_id: string; // The id of the pcap in LIST
    pcap_path: string; // the path to the file to be analyzed
}

export enum Status {
    completed = 'completed',
}

export interface IStatusMessageData {
    pcap: types.IPcapInfo;
    streams: types.IStreamInfo[];
}

export interface IStatusMessage {
    data: IStatusMessageData; // Analysis data
    progress: number; // completion percentage
    status: Status;
    workflow_id: string; // workflow ID passed on the request
}

export function isStatusMessage(v: any): v is IStatusMessage {
    if ((v as IStatusMessage).data === undefined) return false;
    if ((v as IStatusMessage).progress === undefined) return false;
    if ((v as IStatusMessage).status === undefined) return false;
    if ((v as IStatusMessage).workflow_id === undefined) return false;
    return true;
}
