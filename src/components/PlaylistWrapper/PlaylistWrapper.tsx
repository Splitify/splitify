import React, { useState } from 'react'
import PlaylistSelector from './PlaylistSelector'

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import { Icon, Dialog, Box, Paper } from '@material-ui/core'

export default function (props: { text?: string; children?: any }) {
  console.log(props.text)
  let [activePlaylist, setActivePlaylist] = useState(null)
  let [selectorOpen, setSelectorOpen] = useState(false)

  // Default state - have not selected a playlist yet
  // Loaded state - display the playlist component

  return activePlaylist ? (
    props.children || ''
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
        <PlaylistSelector />
      </Dialog>
    </React.Fragment>
  )
}
