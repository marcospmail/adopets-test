import React from 'react';
import { Router, Route } from 'react-router-dom';

import Login from '../pages/Login'
import SearchPage from '../pages/SearchPage';

import history from '../services/history';

const Routes: React.FC = () => {
  return (
    <Router history={history}>
      <Route path="/" exact component={Login} />
      <Route path="/search" exact component={SearchPage} />
    </Router>
  )
}

export default Routes;