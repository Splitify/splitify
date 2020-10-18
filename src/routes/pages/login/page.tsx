/* 
// Login page

*/

import React from 'react'

import Container from '@material-ui/core/Container'
import ConnectButton from '../../../components/BtnConnectToSpotify'

export default function () {
  return (
    <Container maxWidth='sm'>
      <img
        src='https://splitify.github.io/branding/textmark/textmark@72.png'
        width='480px'
      />
      <ConnectButton />
    </Container>
  )
}
