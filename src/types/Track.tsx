import { Album } from "./Album";
import { Features } from "./Features";

export interface Track {
  id: string
  album: Album;
  artists: Array<any>;
  // available_markets: Array<string>
  // disc_number: Number
  duration_ms: Number
  explicit: boolean
  // external_ids: ExternalIdsObj;
  // external_urls: ExternalUrlObj;
  // href: string
  is_local: boolean
  name: string
  popularity: Number
  preview_url: string | null
  track_number: Number
  type: string
  uri: string
  features: Features
}
