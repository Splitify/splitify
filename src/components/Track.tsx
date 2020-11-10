import React, { useState } from 'react'
import { Track as TrackObj } from '../types'
import TrackPopup from './TrackPopup'
import { ListItemText, Typography } from '@material-ui/core'

export default function Track (props: {
  track: TrackObj
  isDragging?: boolean
}): JSX.Element {
  const [popupAnchor, setPopupAnchor] = useState(null)
  
  const audio = props.track.preview_url && new Audio(props.track.preview_url)

  const handlePopoverOpen = (event: any) => {
    props.isDragging || setPopupAnchor(event.currentTarget)
  }

  const handlePopoverClose = () => {
    audio && audio.pause()
    setPopupAnchor(null)
  }

  const handlePreviewClick = () => {
    if (audio) {
      if (!audio.paused || audio.currentTime) {
        audio.pause()
        
      } else {
        audio.currentTime = 0
        audio.play()
      }
    }
  }
  
  return (
      <ListItemText disableTypography={true}>
        <Typography
          aria-haspopup='true'
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          onClick = {handlePreviewClick}
          align='center'
          style={{'userSelect': 'none'}}
        >
          {props.track.name}
        </Typography>
        <TrackPopup track={props.track} anchor={popupAnchor} />
      </ListItemText>
  )
}
