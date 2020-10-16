import React, { FC } from 'react'
import {
  BrowserRouter,
  Switch,
  Redirect,
  Route as RouteBase,
  RouteProps
} from 'react-router-dom'

import Dashboard from './dashboard'
import Login from './login'

export default function () {
  return (
    <BrowserRouter>
      <Switch>

      </Switch>
    </BrowserRouter>
  )
}

/* Routing data */

interface IRoute {
  component: React.ComponentClass
  routeProps?: any
}

const Public: FC<RouteProps & IRoute> = ({
  component: Component,
  ...routeProps
}) => <RouteBase {...routeProps} render={props => <Component {...props} />} />

const Private: FC<RouteProps & IRoute> = ({
  component: Component,
  ...routeProps
}) => (
  <RouteBase
    {...routeProps}
    render={props =>
      /*isAuth()*/ true ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/' }} />
      )
    }
  />
)
