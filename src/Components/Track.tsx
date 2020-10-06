import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

export default function Track() {
    return (
      <React.Fragment>
        <CssBaseline />
    {/*Card with more information about track should pop up on hover*/}
        <Container maxWidth="sm">
            Song Name
        </Container>
      </React.Fragment>
    );
  }

