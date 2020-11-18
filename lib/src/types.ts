import fs from 'fs';

export interface IListOptions {
    baseUrl: string;
    username: string;
    password: string;
}

export interface IVersion {
    major: number;
    minor: number;
    patch: number;
}

export type PcapId = string;

export interface IPcapUploadResult {
    uuid: PcapId;
}
