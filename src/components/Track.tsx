import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { Track as TrackObj } from '../types'
import TrackPopup from './TrackPopup'

import ListItemText from '@material-ui/core/ListItemText'

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
