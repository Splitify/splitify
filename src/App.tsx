import React from 'react'
import { Router } from './routes/'
import MobilePage from './routes/pages/mobile/'
import { isMobileOnly } from 'react-device-detect'

export default function App () {
  return (
    <div className='App'>
      { isMobileOnly ? <MobilePage /> : <Router /> }
    </div>
  )
}
