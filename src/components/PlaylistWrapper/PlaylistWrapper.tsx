import React, { useState } from 'react'
import PlaylistSelector from './PlaylistSelector'

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import { Icon, Dialog, Box, Paper } from '@material-ui/core'
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
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSelect(playlist: Playlist) {
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
        <PlaylistSelector onSelect={handleSelect} onLoading={() => setLoading(true)} />
      </Dialog>
      {playlist ? (
        <MasterPlaylist playlist={playlist} usedTracks={props.usedTracks} onOpenSelector={() => setSelectorOpen(true)} onFilterUpdate={props.onFilterUpdate} />
      ) : (
          <Box
            textAlign='center'
            component={Paper}
            onClick={() => setSelectorOpen(true)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <div>{props.text || 'Select playlists'}</div>
            <Icon component={AddCircleOutlineIcon} />
          </Box>
        )}
    </React.Fragment>
  )
}
