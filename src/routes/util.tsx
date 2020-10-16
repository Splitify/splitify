import React, { FC } from 'react'
import { Route, RouteProps } from 'react-router-dom'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Auth from '../auth'

interface IRoute {
  component: React.ComponentClass
  routeProps?: any
}

export const Public: FC<RouteProps & IRoute> = ({
  component: Component,
  ...routeProps
}) => <Route {...routeProps} render={props => <Component {...props} />} />

export const Private: FC<RouteProps & IRoute> = ({
  component,
  ...routeProps
}) => (
  <Route
    {...routeProps}
    render={props => <AuthProxy {...{ ...props, component }} />}
  />
)

// our components props accept a number for the initial value
const AuthProxy: React.FunctionComponent<{ component: React.ComponentClass }> = ({
  component: Component,
  ...props
}) => {
  const history = useHistory()

  // validate user
  Auth.validate().then(isValid => {
    if (!isValid) {
      // If auth token is invalid, redirect to login
      history.push('/login')
    } else {
      // Else show login
      setReady(true)
    }
  })

  let [ready, setReady] = useState(false)

  if (ready) {
    return <Component {...props} />
  } else {
    return <span>pls wait :)</span>
  }
}
