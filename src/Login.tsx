export const isAuth = (): boolean => {
    console.log(localStorage.getItem("token"))
    return localStorage.getItem("token") !== null;
}

export const login = ():void => {
    const token = redirectToSpotify();
    const o = Object.fromEntries(new URLSearchParams(token))
    localStorage.setItem('token', o.access_token);
}

export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = window.location.origin + "/";
}

function redirectToSpotify() {

    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectURI = `${window.location.protocol}//${window.location.host}/dashboard/`;
    let query = `client_id=${clientId}&redirect_uri=${redirectURI}&response_type=token&`
    window.location.href = `${authEndpoint}?${query}`;
    const o = Object.fromEntries(new URLSearchParams(window.location.hash.substr(1)));
    return o.access_token;
}