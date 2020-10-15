import React from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { isAuth, login } from "../../Login";

interface ILoginProps extends RouteComponentProps {

}

const Login : React.FC<ILoginProps> = () => {

    if(!isAuth()){
        return(
            <Button variant="contained" color="primary" onClick={() => login()}>
                Connect Using Spotify
            </Button>
        )
    }else{
        return(
            <Redirect to={{ pathname: "/dashboard" }} />
        )
    }
}

export default withRouter(Login)