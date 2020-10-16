import { getStorage } from './helpers/localStorage'
import SpotifyAPI from 'spotify-web-api-js'
import { getUserProfile } from './helpers/helpers'
const authStore = getStorage('auth')

export default new (class {
  async login ({ token, expiry }: { token: string; expiry: number }) {
    if (!this.validate(token)) {
      return false
    }
    await authStore.setItem('token', token)
    await authStore.setItem('expiry', new Date(expiry + 3600000))
    return true
  }

  async validate (token?: string) {
    if (!token) {
      let expiry = (await authStore.getItem('expiry')) as Date
      if (!expiry) return false
      if (new Date() > expiry) return false

      let _token = (await authStore.getItem('token')) as string
      if (!_token) return false
      token = _token
    }

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

  async logout () {
    await authStore.clear()
    return true
  }

  async hasAuthToken () {
    return !!await authStore.getItem('token')
  }

  generateEndpoint () {
    const authEndpoint = 'https://accounts.spotify.com/authorize'
    const clientId = process.env.REACT_APP_CLIENT_ID
    const redirectURI = `${window.location.protocol}//${window.location.host}/`
    let query = `client_id=${clientId}&redirect_uri=${redirectURI}&response_type=token`
    return `${authEndpoint}?${query}`
  }
})()
