import React, { FC, useState, useEffect } from 'react'
import { Route, RouteProps } from 'react-router-dom'
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
  useEffect(function () {
    Auth.validate().then(isValid => {
      if (!isValid) {
        // If auth token is invalid, redirect to login
        history.push('/login')
      } else {
        // Else show login
        setReady(true)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let [ready, setReady] = useState(false)

  return ready ? <Component {...props} /> : <></>
}
