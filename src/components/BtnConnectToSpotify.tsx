import React from 'react'
import Button from '@material-ui/core/Button'
import SpotifyIcon from '../images/spotify.svg'
import Auth from '../auth'

import styled from 'styled-components'

function doAuth() {
  window.location.href = Auth.generateEndpoint()
}

const Content = styled.span`
  /* Add splitify icon */
  &:before {
    background-size: cover;
    display: inline-block;
    content: '';
    width: 1.6em;
    height: 1.6em;
    vertical-align: middle;
    background-image: url(${SpotifyIcon});
    margin-right: 5px;
  }
`

export default function () {
  return (
    <Button
      variant='contained'
      color='primary'
      style={{ backgroundColor: '#1DB954' }}
      onClick={doAuth}
    >
      <Content>Connect Using Spotify</Content>
    </Button>
  )
}
