import React, { useState } from 'react'
import PlaylistSelector from './PlaylistSelector'

import { Dialog } from '@material-ui/core'
import { Playlist, Track as TrackObj } from '../../types'
import MasterPlaylist from '../MasterPlaylist'

export default function (props: {
  text?: string
  playlist?: Playlist
  usedTracks: TrackObj[],
  onSelect?: (playlist: Playlist) => any
  onFilterUpdate?: (tracks: TrackObj[]) => any
}) {
  const [playlist, setPlaylist] = useState(props.playlist)
  const [selectorOpen, setSelectorOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  function handleSelect(playlist: Playlist) {
    setLoading(true)
    setPlaylist(playlist)
    if (props.onSelect) props.onSelect(playlist)
    setSelectorOpen(false)
    setLoading(false)
  }
  // Default state - have not selected a playlist yet
  // Loaded state - display the playlist component

  return (
    <React.Fragment>
      <Dialog open={selectorOpen} onClose={() => setSelectorOpen(false || loading)}>
        <PlaylistSelector onSelect={handleSelect}/>
      </Dialog>
      {playlist ? (
        <MasterPlaylist playlist={playlist} usedTracks={props.usedTracks} onOpenSelector={() => setSelectorOpen(true)} onFilterUpdate={props.onFilterUpdate} />
      ) : (<div />)}
    </React.Fragment>
  )
}
