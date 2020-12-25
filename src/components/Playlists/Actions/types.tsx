export type TrackListActionType = 'deleteTracks' | 'sortTracks' | 'groupTracks'

export type SubplaylistActionType =
  | TrackListActionType
  | 'deletePlaylist'
  | 'filterUpdate'
  | 'trackUpdate'
