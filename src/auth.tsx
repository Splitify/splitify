import { getStorage } from './helpers/localStorage'
import SpotifyAPI from 'spotify-web-api-js'
import { getUserProfile } from './helpers/helpers'
const authStore = getStorage('auth')

export default new (class {
  async login ({
    access_token,
    expires_in
  }: {
    access_token: string
    expires_in: number
  }) {
    if (!this.validate(access_token)) {
      return false
    }
    await authStore.setItem('token', access_token)
    await authStore.setItem('expiry', 
      new Date(new Date().getTime() + expires_in * 1000)
    )
    return true
  }

  async validate (token?: string) {
    async function doValidate () {
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

    if (!(await doValidate())) {
      await this.logout()
      return false
    } else {
      return true
    }
  }

  async logout () {
    await authStore.clear()
    return true
  }

  async hasAuthToken () {
    return !!(await authStore.getItem('token'))
  }

  generateEndpoint () {
    const authEndpoint = 'https://accounts.spotify.com/authorize'

    let data = {
      client_id: process.env.REACT_APP_CLIENT_ID,
      redirect_uri: `${window.location.protocol}//${window.location.host}/login`,
      response_type: 'token'
    }
    return `${authEndpoint}?${new URLSearchParams(data as any).toString()}`
  }
})()
