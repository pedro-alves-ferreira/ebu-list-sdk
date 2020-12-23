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

// analysis
export type PcapId = string;
export type FileName = string;
export type MediaType = string;

export interface IPcapUploadResult {
    uuid: PcapId;
}

export interface IPcapInfo {
    file_name: FileName;
}

export interface IStreamInfo {
    media_type: MediaType;
}

// live
export interface LiveMeta {
    label: string;
}

export interface Sdp {
    streams: string;
}

export interface ILiveSource {
    id: string;
    meta: LiveMeta;
    sdp: Sdp;
}
