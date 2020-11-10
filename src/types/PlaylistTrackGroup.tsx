import { Track } from './Track';
import { PlaylistTrack } from './PlaylistTrack';

export interface PlaylistTrackGroup extends PlaylistTrack {
  tracks: PlaylistTrack[]

  // Has the track properties of Track
  // They act as proxies to the first item in `tracks`
}
