import React, { FC } from 'react'
import { RouteProps, Route, Redirect } from 'react-router-dom'

interface IRoute {
  component: React.ComponentClass
  routeProps?: any
}

export const Public: FC<RouteProps & IRoute> = ({
  component: Component,
  ...routeProps
}) => <Route {...routeProps} render={props => <Component {...props} />} />

export const Private: FC<RouteProps & IRoute> = ({
  component: Component,
  ...routeProps
}) => (
  <Route
    {...routeProps}
    render={props =>
      // FIXME: Centralise auth
      /*isAuth()*/ true ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/' }} />
      )
    }
  />
)
