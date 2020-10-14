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
    height: Number | null;
    url: string;
    width: Number | null;
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
    artists: ArtistObj;
    available_markets: string[];
    external_urls: ExternalUrlObj;
    href: string;
    id: string;
    images: Array<ImageObj>;
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: RestrictionObj;
    type: string;
    uri: string;
}

export interface FollowerObj {
    href: string;
    total: Number
}

export interface  UserObj {
    display_name: string | null;
    external_urls: ExternalUrlObj;
    followers?: FollowerObj;
    href: string;
    id: string;
    images?: Array<ImageObj>;
    type: string;
    uri: string;
}

export interface TrackObj {
    album: AlbumObj;
    artists: Array<ArtistObj>;
    available_markets: [string];
    disc_number : Number;
    duration_ms: Number;
    explicit: boolean;
    external_ids: ExternalIdsObj;
    external_urls: ExternalUrlObj;
    href: string;
    id: string;
    is_local: boolean;
    is_playable: boolean;
    name: string;
    popularity: Number;
    preview_url: string;
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
    public: boolean | null;
    snapshot_id: string;
    tracks: Array<TrackObj>
    type: string;
    uri: string;
}