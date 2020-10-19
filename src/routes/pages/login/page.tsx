/* 
// Login page

*/

import React from 'react'

import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';

import Textmark from "../../../images/textmark@72.png"

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
        <img
          src={Textmark}
          width='480px'
          alt="Splitify"
        />
        <Typography variant="h6" paragraph={true} style={{marginTop: "5px", color: "#383735"}} >Your last Spotify playlist management tool</Typography>
        <ConnectButton />
      </Box>
    </Container>
  )
}
