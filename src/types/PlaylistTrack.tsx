import { Track } from './Track'

export interface PlaylistTrackBase {
  isCustom?: boolean
}

export interface PlaylistTrack extends PlaylistTrackBase, Track {
  track: Track
}
