import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { TrackObj } from '../helpers/interfaces';


interface ComponentProps {
  track: TrackObj
}


export default function Track(props: ComponentProps):JSX.Element {
    return (
      <React.Fragment>
        <CssBaseline />
    {/*Card with more information about track should pop up on hover*/}
        <Container maxWidth="sm">
          {props.track.name}
        </Container>
      </React.Fragment>
    );
  }

