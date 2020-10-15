import React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { isAuth } from "../../Login";

export interface IPrivateRouteProps extends RouteProps {
    component: any;
}
  
const PrivateRoute: React.FC<IPrivateRouteProps> = ({ component: Component, ...rest }) => (

    <Route {...rest} render={ props => (
        isAuth() ? (
            <Component {...props} /> 
        ) : ( 
            <Redirect to={{ pathname: "/" }} />
        )
    )}/>
);

export default PrivateRoute