/* 
// Login page

*/

import React from 'react'

import Container from '@material-ui/core/Container'
import Textmark from "../../../images/textmark@72.png"
import ConnectButton from '../../../components/BtnConnectToSpotify'

export default function () {
  return (
    <Container maxWidth='sm'>
      <img
          src={Textmark}
        width='480px'
      />
      <ConnectButton />
    </Container>
  )
}
