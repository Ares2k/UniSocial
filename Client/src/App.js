import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Views/Register/Register';
import Login from './Views/Login/Login';
import UserProfile from './Views/UserProfile';
import MutualUsers from './Views/MutualUsers';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path='/register' element={<Register />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/profile/edit' element={<UserProfile />}/>
            <Route path='/users/mutual' element={<MutualUsers />}/>
          </Routes>
        </div>
      </Router>
    );
  }
}
