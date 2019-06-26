import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Debugger from './Debugger';
import Generator from './Generator';
import Page404 from './components/Page404';

const Routes = () => (
  <Switch>
    <Route path={['/debugger', '/debugger.html']} component={Debugger} />
    <Route path={['/guarantee-generator', '/guarantee-generator.html']} component={Generator} />
    <Route path="/" exact component={Debugger} />
    <Route component={Page404} />
  </Switch>
);


export default Routes;
