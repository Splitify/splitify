export interface ArtistObj {
    external_urls: ExternalUrlObj;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}
  
export interface ExternalUrlObj {
    [key: string]: string;
}
  
export interface ImageObj {
    height?: Number | null;
    url: string;
    width?: Number | null;
}
  
export interface RestrictionObj {
    reason: string;
}
  
export interface ExternalIdsObj {
    [key: string]: string;
}

export interface AlbumObj {
    album_group?: string;
    album_type: string;
    artists: Array<ArtistObj>;
    available_markets: Array<string>;
    external_urls: ExternalUrlObj;
    href: string;
    id: string;
    images: Array<ImageObj>;
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions?: RestrictionObj;
    type: string;
    uri: string;
}

export interface FollowerObj {
    href: string;
    total: Number
}

export interface  UserObj {
    display_name?: string | null;
    external_urls: ExternalUrlObj;
    followers?: FollowerObj;
    href: string;
    id: string;
    images?: Array<ImageObj>;
    type: string;
    uri: string;
}

export interface UrlThumbnail{
    url: string | null
}
export interface PlaylistTrackObj {
    added_at: string
    added_by: UserObj	
    is_local: boolean
    track: TrackObj
    video_thumbnail: UrlThumbnail
}

export interface PagingObj {
    href: string	
    items: Array<PlaylistTrackObj>
    limit: Number
    next: string | null
    offset:	Number
    previous: string | null
    total: Number
}

export interface TrackObj {
    album: AlbumObj;
    artists: Array<ArtistObj>;
    available_markets: Array<string>;
    disc_number : Number;
    duration_ms: Number;
    explicit: boolean;
    external_ids: ExternalIdsObj;
    external_urls: ExternalUrlObj;
    href: string;
    id: string;
    is_local: boolean;
    is_playable?: boolean;
    name: string;
    popularity: Number;
    preview_url: string | null;
    track_number: Number;
    type: string;
    uri: string;
  }

  export interface PlaylistObj {
    collaborative: boolean;
    description: string;
    external_urls: ExternalUrlObj
    href: string;
    id: string;
    images: Array<ImageObj>
    name: string;
    owner: UserObj;
    public?: boolean | null;
    snapshot_id: string;
    tracks: PagingObj
    type: string;
    uri: string;
}