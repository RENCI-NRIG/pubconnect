import React from 'react';
import { Router } from '@reach/router';
import Login from './views/Login';
import Home from './views/Home';
import Verify from './views/Verify';
import Submit from './views/Submit';
import './App.css';
import { useBeforeunload } from 'react-beforeunload';

function App() {
  useBeforeunload(() => "Are you sure to leave?")
  return (
    <Router style={{ height: '100%'}}>
      <Submit path="/submit" />
      <Verify path="/verify" />
      <Home path="/home" />
      <Login path="/" />
    </Router>

  );
}

export default App;
