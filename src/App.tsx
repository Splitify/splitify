import React from 'react'
import { Router } from './routes/'
import MobilePage from './routes/pages/mobile/'
import { isMobile } from 'react-device-detect'

export default function App () {
  return (
    <div className='App'>
      { isMobile ? <MobilePage /> : <Router /> }
    </div>
  )
}
