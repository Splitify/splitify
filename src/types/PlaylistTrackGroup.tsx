import { Track } from './Track'

export interface PlaylistTrackGroup extends Track {
  tracks: Track[]

  // Has the track properties of Track
  // They act as proxies to the first item in `tracks`
}
