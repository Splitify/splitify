import { getStorage } from './helpers/localStorage'
import SpotifyAPI from 'spotify-web-api-js'
import { getUserProfile } from './helpers/helpers'

const authStore = getStorage('auth')

export default new (class {

  // Login function, takes in access_token and expires_in (seconds)
  async login ({
    access_token,
    expires_in
  }: {
    access_token: string
    expires_in: number
  }) {
    // Check if the access token is valid
    if (!this.validate(access_token)) {
      return false
    }

    // Store token and expiry time
    await authStore.setItem('token', access_token)
    await authStore.setItem('expiry', 
      new Date(new Date().getTime() + expires_in * 1000)
    )

    return true
  }

  async validate (token?: string) {

    // Function: Validate access token (i.e. is the access token active)
    async function doValidate () {
      // If a token was not explicitly passed, use the stored token
      if (!token) {
        let expiry = (await authStore.getItem('expiry')) as Date
        if (!expiry) return false // Check exist
        if (new Date() > expiry) return false // Check elapsed

        let _token = (await authStore.getItem('token')) as string
        if (!_token) return false // Check exist
        token = _token
      }

      // Get user profile data from Spotify
      let api = new SpotifyAPI()
      api.setAccessToken(token)
      try {
        let profile = await getUserProfile(api)
        await authStore.setItem('profile', profile)
        return true
      } catch (e) {
        console.error(e)
        return false
      }
    }

    /* 
    Actually check the validity
    Force logout if invalid 
    */

    if (!(await doValidate())) {
      await this.logout()
      return false
    } else {
      return true
    }
  }

  // Clear stored auth data
  async logout () {
    await authStore.clear()
    return true
  }

  // Check if an auth token exists
  // Used for simple pre-validated page access
  async hasAuthToken () {
    return !!(await authStore.getItem('token'))
  }

  // Get Spotify authentication endpoint
  generateEndpoint () {
    const authEndpoint = 'https://accounts.spotify.com/authorize'

    let data = {
      client_id: process.env.SPOTIFY_CLIENT_ID,
      redirect_uri: `${window.location.protocol}//${window.location.host}/login`,
      response_type: 'token'
    }
    return `${authEndpoint}?${new URLSearchParams(data as any).toString()}`
  }
})()
