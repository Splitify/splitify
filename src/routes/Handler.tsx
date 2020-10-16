import React from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import { Public, Private } from './util'

import Dashboard from './pages/dashboard'
import Login from './pages/login'

export const Router: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Public exact path='/' component={Login} />
      <Private exact path='/dashboard' component={Dashboard} />
    </Switch>
  </BrowserRouter>
)
