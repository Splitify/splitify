import React from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { isAuth, login } from "../../Login";

interface ILoginProps extends RouteComponentProps {

}

const Login : React.FC<ILoginProps> = () => {

    if(isAuth()){
        console.log("IS AUTHED");
        return(
            <Redirect to={{ pathname: "/dashboard" }} />
        )
    }

    const hash_params = window.location.hash.substr(1);
    console.log(hash_params);
    if(hash_params !== ""){
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
        const auth_obj = Object.fromEntries(new URLSearchParams(hash_params));
        localStorage.setItem('token', auth_obj.access_token);
        return(
            <Redirect to={{ pathname: "/dashboard" }} />
        )
    }else{
        return(
            <Button variant="contained" color="primary" onClick={() => login()}>
                Connect Using Spotify
            </Button>
        )
    }
}

export default withRouter(Login)