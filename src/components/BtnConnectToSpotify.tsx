import React from 'react'
import Button from '@material-ui/core/Button'
import SpotifyIcon from '../icons/spotify.svg'
import Auth from '../auth'

import styled from 'styled-components'

const Content = styled.span`
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
      onClick={() => {
        window.location.href = Auth.generateEndpoint()
      }}
    >
      <Content>Connect Using Spotify</Content>
    </Button>
  )
}
