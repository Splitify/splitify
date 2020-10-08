import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

interface ComponentProps {
  songname: string;
  genre: string
}


export default function Track(props: ComponentProps):JSX.Element {

    return (
      <React.Fragment>
        <CssBaseline />
    {/*Card with more information about track should pop up on hover*/}
        <Container maxWidth="sm">
          {props.songname}&nbsp;|&nbsp;
          {props.genre}
        </Container>
      </React.Fragment>
    );
  }

