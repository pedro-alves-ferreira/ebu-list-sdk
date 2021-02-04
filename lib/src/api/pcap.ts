export interface IProblem {
    stream_id: string | null; // If null, applies to the whole pcap, e.g. truncated
    value: {
        id: string; // Problem id
    };
}

export interface IPcapInfo {
    analyzed: boolean; // True if the analysis is thoroughly complete
    analyzer_version: string; // The version of LIST when the analysis was done
    anc_streams: number; // Number of ancillary data streams
    audio_streams: number; // Number of audio streams
    capture_date: number; // capture date, extracted from the pcap file
    date: number; // date of analysis
    file_name: string; // TODO check this
    id: string; // unique id of the pcap
    narrow_linear_streams: number; // ST2110-21
    narrow_streams: number; // ST2110-21
    not_compliant_streams: number; // Number of stream that have at least one failed validation
    offset_from_ptp_clock: number; // deprecated
    pcap_file_name: string; // TODO check this
    total_streams: number; // Total number of streams
    truncated: boolean; // True if the pcap does not contain the complete packet payload
    video_streams: number; // Number of video streams
    wide_streams: number; // ST2110-21
    summary: { error_list: IProblem[]; warning_list: IProblem[] };
}

export type Rate = '24000/1001' | '24' | '25' | '30000/1001' | '30' | '50' | '60000/1001' | '60';
export type Colorimetry = 'BT601' | 'BT709' | 'BT2020';
export type ColorSampling = 'YCbCr-4:2:2';
export type ScanType = 'progressive' | 'interlaced';
export type ST211021Schedule = 'gapped' | 'linear';

export interface IST2110VideoInfo {
    avg_tro_ns: number; // ST2110-21, nanoseconds
    color_depth: number; // bits per sample
    colorimetry: Colorimetry;
    has_continuation_bit_set: boolean; // true if at least one packet has the C-bit set
    height: number; // Frame height. If interlaced 2 * field height
    max_tro_ns: number; // ST2110-21, nanoseconds
    min_tro_ns: number; // ST2110-21, nanoseconds
    packets_per_frame: number; // number of packets per frame
    packing_mode: number; // TODO check this
    rate: Rate; // Frame or field rate, as a fraction
    sampling: ColorSampling;
    scan_type: ScanType;
    schedule: ST211021Schedule;
    tro_default_ns: number; // As defined in ST2110-21 for this format, in nanoseconds;
    width: number; // Frame/field width
}

export interface IST2110AudioInfo {
    encoding: 'L16' | 'L24';
    number_channels: number;
    packet_time: string;
    sampling: string;
}

export interface IST2110SubSubstream {
    filename: string;
    type: string;
}

export interface IST2110Substream {
    did_sdid: number;
    errors: number;
    line: number;
    num: number;
    offset: number;
    packet_count: number;
    sub_sub_streams: IST2110SubSubstream[];
}
export interface IST2110AncInfo {
    packets_per_frame: number;
    rate: Rate;
    scan_type: ScanType;
    sub_streams?: IST2110Substream[];
}

export type MediaSpecificInfo = IST2110VideoInfo | IST2110AudioInfo | IST2110AncInfo;
export type MediaType = 'video' | 'audio' | 'ancillary_data' | 'unknown';

// The reasons why the heuristics deemed the other possible formats as invalid
export interface IMediaTypeValidation {
    anc?: string[]; // 'STATUS_CODE_ANC_WRONG_HEADER' ...
    audio?: string[]; // 'STATUS_CODE_AUDIO_DIFFERENCE_VALUE_EQUAL_TO_ZERO' ...
    ttml?: string[]; // 'STATUS_CODE_TTML_INVALID_DOCUMENT' ...
    video?: string[]; // 'STATUS_CODE_TTML_INVALID_DOCUMENT' ...
}

export interface IDscpInfo {
    consistent: boolean; // True if the valus remain consistent for the whole stream
    value: number; // The actual value, if consistent
}

// All in nanosecond
export interface IVideoPacketSpacing {
    avg: number;
    max: number;
    min: number;
}

export interface IVideoPacketSpacingInfo {
    after_m_bit: IVideoPacketSpacing;
    regular: IVideoPacketSpacing;
}

export interface INetworkInformation {
    destination_address: string; // destination IP address
    destination_mac_address: string; // destination Ethernet MAC address
    destination_port: string; // destination UDP port
    dscp: IDscpInfo;
    has_extended_header: boolean; // True if the RTP X bit is set for any packet
    inter_packet_spacing?: IVideoPacketSpacingInfo;
    multicast_address_match: boolean; // true if the IP and MAC addresses are consistent
    payload_type: number; // RTP payload type
    source_address: string; // source IP address
    source_mac_address: string; // source Ethernet MAC address
    source_port: string; // source UDP port
    ssrc: number; // RTP SSRC
    valid_multicast_ip_address: boolean; // True of the IP address is a valid multicast address
    valid_multicast_mac_address: boolean; // True of the MAC address is a valid multicast address
}

export type StreamState = 'ready' | 'analyzed'; // TODO check this

export interface IStreamStatistics {
    dropped_packet_count: number; // Number of dropped RTP packets
    dropped_packet_samples: any[]; // TODO check this
    first_frame_ts?: number; // RTP timestamp of the first frame - Video TODO move this to media specific
    first_packet_ts: string; // The abosulte timestamp of the first packet
    frame_count?: number; // Number of video frames. TODO move this to media specific
    is_interlaced?: boolean; // Video TODO move this to media specific
    last_frame_ts?: number; // RTP timestamp of the last frame - Video TODO move this to media specific
    last_packet_ts: string; // The abosulte timestamp of the last packet
    max_line_number?: number; // Video TODO move this to media specific
    packet_count: number; // Total number of RTP packets
    rate?: number; // Video frame/field rate TODO move this to media specific
}

export interface IStreamInfo {
    id: string; // Unique ID of the stream
    media_specific?: MediaSpecificInfo; // Not set if stream is unknown
    media_type: MediaType;
    media_type_validation?: IMediaTypeValidation;
    network_information: INetworkInformation;
    pcap: string; // The id of the pcap on which this stream is contained
    state: StreamState;
    statistics: IStreamStatistics;
}
