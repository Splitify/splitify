import React from 'react'
import Textmark from '../../../images/textmark@72.png'
import './page.css'

const styles = {
  container: {
    margin: 10,

    height: '100vh',

    display: 'flex',
    flexDirection: "column" as const, // Bug in typescript?

    textAlign: 'center' as const,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: '100%',
    maxWidth: 480
  }
}

export default function () {
  return (
    <div style={styles.container} >
      <div className="animateFlicker">
        <img src={Textmark} style={styles.logo} alt='Splitify' />
      </div>
      <h1>So about that...</h1>
      <p>Splitify is not compatible on mobile devices. :(</p>
      But you wouldn't want to experience all this greatness on a tiny screen
      anyway!
    </div>
  )
}
