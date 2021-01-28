import * as api from './api';

export type IPcapInfo = api.pcap.IPcapInfo;
export type IStreamInfo = api.pcap.IStreamInfo;

export interface IVersion {
    major: number;
    minor: number;
    patch: number;
}

// analysis
export type PcapId = string;
export type FileName = string;
export type MediaType = string;

export interface IPcapUploadResult {
    uuid: PcapId;
}

// live
export interface ILiveMeta {
    label: string;
}

export interface ISdp {
    streams: string;
}

export interface ILiveSource {
    id: string;
    meta: ILiveMeta;
    sdp: ISdp;
}
