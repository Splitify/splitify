import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'

import { Track as TrackObj } from '../types'

export default function Track (props: { track: TrackObj }): JSX.Element {
  return (
    <React.Fragment>
      <CssBaseline />
      {/*Card with more information about track should pop up on hover*/}
      <Container maxWidth='sm'>{props.track.name}</Container>
    </React.Fragment>
  )
}
