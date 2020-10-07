export default function() {

    let token  = window.location.hash.substr(1);
    if(token) {
        const o = Object.fromEntries(new URLSearchParams(token));
        return o.access_token;
    } else {
        return redirectToSpotify();
    }
}

function redirectToSpotify() {

    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectURI = `${window.location.protocol}//${window.location.host}/`;
    console.log(redirectURI)
    //let sess_id = /SESS\w*ID=([^;]+)/i.test(document.cookie) ? RegExp.$1 : false;
    //const state = hash(sess_id)
    let query = `client_id=${clientId}&redirect_uri=${redirectURI}&response_type=token&`
    window.location.href = `${authEndpoint}?${query}`;
    return window.location.hash.substr(1);
}