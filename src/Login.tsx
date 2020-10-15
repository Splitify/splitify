export const isAuth = (): boolean => {
    if(localStorage.getItem("token") === "undefined"){
        const hash_params = window.location.hash.substr(1);
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
        const auth_obj = Object.fromEntries(new URLSearchParams(hash_params));
        localStorage.setItem('token', auth_obj.access_token);
        return true;
    }else if(localStorage.getItem("token") === null){
        return false;
    }else{
        console.log(localStorage.getItem('token'))
        return true;
    }


}

export const login = ():void => {
    const hash_params = redirectToSpotify();
    const auth_obj = Object.fromEntries(new URLSearchParams(hash_params));
    localStorage.setItem('token', auth_obj.access_token);
}

export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = window.location.origin + "/";
}

export const redirectToSpotify = () => {
    console.log("GOT TO SPOTIFY REDIRECT");
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectURI = `${window.location.protocol}//${window.location.host}/dashboard/`;
    let query = `client_id=${clientId}&redirect_uri=${redirectURI}&response_type=token`
    window.location.href = `${authEndpoint}?${query}`;
    return window.location.hash.substr(1);
}