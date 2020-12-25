export const isAuth = (): boolean => {
  return (
    localStorage.getItem('token') !== null &&
    localStorage.getItem('token') !== 'undefined'
  )
}

export const login = (): void => {
  const hash_params = redirectToSpotify()
  const auth_obj = Object.fromEntries(new URLSearchParams(hash_params))
  localStorage.setItem('token', auth_obj.access_token)
}

export const logout = () => {
  localStorage.removeItem('token')
  window.location.href = window.location.origin + '/'
}

export const redirectToSpotify = () => {
  const authEndpoint = 'https://accounts.spotify.com/authorize'
  const clientId = process.env.REACT_APP_CLIENT_ID
  const redirectURI = `${window.location.protocol}//${window.location.host}/`
  let query = `client_id=${clientId}&redirect_uri=${redirectURI}&response_type=token`
  window.location.href = `${authEndpoint}?${query}`
  return window.location.hash.substr(1)
}
