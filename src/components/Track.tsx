import React from 'react'
import { Track as TrackObj } from '../types'
import TrackPopup from './TrackPopup'
import { isTrackCustom } from '../helpers/helpers'
import { ListItemText, Typography } from '@material-ui/core'

export default function Track (props: {
  track: TrackObj
  isDragging?: boolean
}): JSX.Element {
  const [popupAnchor, setPopupAnchor] = React.useState(null)
  // eslint-disable-next-line
  const [audio, setAudio] = React.useState(new Audio(props.track.preview_url));
  const[playing, setPlaying] = React.useState(false)

  const handlePopoverOpen = (event: any) => {
    props.isDragging || setPopupAnchor(event.currentTarget)
  }
  const handlePlaying = () =>{
    audio.pause()
    setPlaying(false)
  }
  const handlePaused = () =>{
    audio.play()
    setPlaying(true)
  }
  const handlePopoverClose = () => {
    if (playing) handlePlaying()
    setPopupAnchor(null)
  }

  const handlePreviewClick = () => {
      playing?handlePlaying():handlePaused()
  }
  
  return (
      <ListItemText disableTypography={true}>
        <Typography
          aria-haspopup='true'
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          onClick = {handlePreviewClick}
          align='center'
          style={{'userSelect': 'none', ...(isTrackCustom(props.track) && {color: 'red'})}}
        >
          {props.track.name}
        </Typography>
        <TrackPopup track={props.track} anchor={popupAnchor} />
      </ListItemText>
  )
}
