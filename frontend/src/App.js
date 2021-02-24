import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './views/Login';
import Home from './views/Home';
import Verify from './views/Verify';
import Submit from './views/Submit';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/submit" component={Submit}></Route>
          <Route path="/verify" component={Verify}></Route>
          <Route path="/home" component={Home}></Route>
          <Route path="/" component={Login}></Route>
        </Switch>
      </div>
    </Router>

  );
}

export default App;
