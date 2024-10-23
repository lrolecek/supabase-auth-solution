import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {BrowserRouter, Routes, Route} from 'react-router-dom'

import {AuthProvider} from './context/AuthContext'
import {AuthRoute} from './components/AuthRoute'

import App from './App.jsx'
import Home from './components/Home'
import About from './components/About'
import Secret from './components/Secret'
import Login from './components/Login'
import Register from './components/Register'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route element={<AuthRoute />}>
              <Route path="secret" element={<Secret />} />
            </Route>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
