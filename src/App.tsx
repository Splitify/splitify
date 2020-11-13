import React from 'react'
import { Router } from './routes/'
import { isMobile } from 'react-device-detect'
import MobilePage from './routes/pages/mobile'

export default function App () {
  return (
    <div className='App'>
      { isMobile ? <MobilePage /> : <Router /> }
    </div>
  )
}
