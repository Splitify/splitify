import React from 'react'
import { useHistory, RouteComponentProps, withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Auth from '../../auth'

const Login: React.FC<RouteComponentProps> = () => {
  const history = useHistory()

  Auth.hasAuthToken().then(bool => {
    // Navigate back to the homepage if the user already has an authentication token
    if (bool) {
      console.info('Should go to dashboard because token found')
      // history.push('/')
    }
  })

  // Case: Authentication callback
  const hash_params = window.location.hash.substr(1)

  if (hash_params !== '') {
    const auth_obj = Object.fromEntries(new URLSearchParams(hash_params))
    Auth.login({
      access_token: auth_obj.access_token,
      expires_in: Number(auth_obj.expires_in)
    }).then(() => history.push('/'))

    return <span>Authenticating...</span>

  } else {
    // Case: Login page
    console.log('Login page')
    return (
      <Button
        variant='contained'
        color='primary'
        onClick={() => {
          window.location.href = Auth.generateEndpoint()
        }}
      >
        Connect Using Spotify
      </Button>
    )
  }
}

export default withRouter(Login)
