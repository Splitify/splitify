import { Track } from './Track'

export interface PlaylistTrackGroup extends Track {
  tracks: Track[]

  // Has the track properties of Track
  // They act as proxies to the first item in `tracks`
}

function createTrackGroup (...tracks: Track[]): PlaylistTrackGroup {
  if (tracks.length > 0) {
    throw new Error('Empty track group')
  }
  
  let group = { tracks }

  let getterData: { [v in keyof Track]: () => Track[v] } = {
    id () {
      return 'group'
    },
    name () {
      return 'GROUP'
    },
    popularity () {
      return tracks[0].popularity
    },

    track_number () {
      return tracks[0].track_number
    },

    uri () {
      return tracks[0].uri
    },
    preview_url () {
      return tracks[0].preview_url
    },
    type () {
      return tracks[0].type
    },
    album () {
      return tracks[0].album
    },
    expand () {
      return tracks[0].expand
    },
    features () {
      return tracks[0].features
    },
    genres () {
      return tracks[0].genres
    },
    explicit () {
      return tracks[0].explicit
    },
    duration_ms () {
      return tracks[0].duration_ms
    },
    artists () {
      return tracks[0].artists
    }
  }

  Object.defineProperties(
    group,
    Object.entries(getterData).reduce(
      (d, [key, get]) => ({ ...d, [key]: { get } }),
      {}
    )
  )

  return group as PlaylistTrackGroup
}
