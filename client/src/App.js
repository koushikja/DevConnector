import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/layouts/Navbar';
import { Landing } from './components/layouts/Landing'
import { Register } from './components/auth/Register'
import { Login } from './components/auth/Login'

import './App.css';

const App = () => (
<Router>

  <Fragment>
    <Navbar></Navbar>


    <Routes>
      <Route path='/' element={<Landing />}/>

      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />

    </Routes>

  </Fragment>
</Router>
);


export default App;