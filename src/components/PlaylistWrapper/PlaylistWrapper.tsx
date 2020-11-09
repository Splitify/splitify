import React, { useState } from 'react'
import PlaylistSelector from './PlaylistSelector'

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import { Icon, Dialog, Box, Paper } from '@material-ui/core'
import { Playlist, Track as TrackObj } from '../../types'

export default function (props: {
  text?: string
  playlist?: Playlist
  component: any,
  usedTracks: TrackObj[],
  onSelect?: (playlist: Playlist) => any
}) {
  const { component: Component, usedTracks} = props

  let [playlist, setPlaylist] = useState(props.playlist)
  let [selectorOpen, setSelectorOpen] = useState(false)

  function handleSelect (playlist: Playlist) {
    setPlaylist(playlist)
    if (props.onSelect) props.onSelect(playlist)
    setSelectorOpen(false)
  }
  // Default state - have not selected a playlist yet
  // Loaded state - display the playlist component

  return playlist ? (
    <Component playlist={playlist} usedTracks={usedTracks}/>
  ) : (
    <React.Fragment>
      <Box
        textAlign='center'
        component={Paper}
        onClick={() => setSelectorOpen(true)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <div>{props.text || 'Select playlists'}</div>
        <Icon component={AddCircleOutlineIcon} />
      </Box>

      <Dialog open={selectorOpen} onClose={() => setSelectorOpen(false)}>
        <PlaylistSelector onSelect={handleSelect} />
      </Dialog>
    </React.Fragment>
  )
}
