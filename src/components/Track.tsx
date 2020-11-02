import React from 'react'
import { Track as TrackObj } from '../types'
import TrackPopup from './TrackPopup'
import { ListItemText, Typography } from '@material-ui/core'

export default function Track (props: {
  track: TrackObj
  isDragging?: boolean
}): JSX.Element {
  const [popupAnchor, setPopupAnchor] = React.useState(null)

  const handlePopoverOpen = (event: any) => {
    props.isDragging || setPopupAnchor(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setPopupAnchor(null)
  }

  return (
    <React.Fragment>
      <ListItemText>
        <Typography
          aria-haspopup='true'
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          align='center'
        >
          {props.track.name}
        </Typography>
      </ListItemText>
      <TrackPopup track={props.track} anchor={popupAnchor} />
    </React.Fragment>
  )
}
