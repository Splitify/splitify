import React, { useState } from 'react'
import PlaylistSelector from './PlaylistSelector'

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import { Icon, Dialog, Box, Paper } from '@material-ui/core'
import { Playlist } from '../../types'

export default function (props: {
  text?: string
  playlist?: Playlist
  component: any,
  onSelect?: (playlist: Playlist) => any
}) {
  const { component: Component } = props

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
    <Component playlist={playlist} />
  ) : (
    <React.Fragment>
      <Box
        textAlign='center'
        component={Paper}
        onClick={() => setSelectorOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        <div>{props.text || 'Select a playlist'}</div>
        <Icon component={AddCircleOutlineIcon} />
      </Box>

      <Dialog open={selectorOpen} onClose={() => setSelectorOpen(false)}>
        <PlaylistSelector onSelect={handleSelect} />
      </Dialog>
    </React.Fragment>
  )
}
