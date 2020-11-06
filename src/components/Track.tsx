import React from 'react'
import { Track as TrackObj } from '../types'
import TrackPopup from './TrackPopup'
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

  const handlePopoverClose = () => {
    if (playing === true){
      audio.pause()
      setPlaying(false)
      console.log('its pausing !')
    }
    setPopupAnchor(null)
  }
  const handlePreviewClick = () => {
      if (playing === false){
        audio.play()
        setPlaying(true)
        console.log('its playing !')
      }else{
        audio.pause()
        setPlaying(false)
        console.log('its pausing !')
      }
  }
  
  return (
    <React.Fragment>
      <ListItemText>
        <Typography
          aria-haspopup='true'
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          onClick = {handlePreviewClick}
          align='center'
        >
          {props.track.name}
        </Typography>
      </ListItemText>
      <TrackPopup track={props.track} anchor={popupAnchor} />
    </React.Fragment>
  )
}
