import React from 'react'

import { Box, Container, Typography } from '@material-ui/core'

import Textmark from '../../../images/textmark@72.png'

import SpotifyLogo from '../../../images/spotify.png'
import LastFMLogo from '../../../images/lastfm.svg'

import ConnectButton from '../../../components/BtnConnectToSpotify'

export default function () {
  return (
    <Container maxWidth='sm'>
      <Box
        height='100vh'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
      >
        <img src={Textmark} width='480px' alt='Splitify' />
        <Typography
          variant='h6'
          paragraph={true}
          style={{ marginTop: '5px', color: '#383735' }}
        >
          Your last Spotify playlist management tool
        </Typography>
        <ConnectButton />

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <h3>Powered by</h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img
              height='50px'
              width='100%'
              alt='Last.fm Logo'
              src={LastFMLogo}
            />
            <img
              height='80px'
              width='80px'
              style={{ marginTop: 20 }}
              alt='Spotify Logo'
              src={SpotifyLogo}
            />
          </div>
        </div>
      </Box>
    </Container>
  )
}
