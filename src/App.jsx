import './App.css'

import {NavLink, Outlet} from 'react-router-dom'

import {useAuth} from './context/AuthContext'

import UserStatus from './components/UserStatus'


function App() {

  const {isAuth} = useAuth()

  return (
    <>
      <h1>Supabase + Auth + Router</h1>

      <header className="header">
        <nav className="menu">
          <NavLink to="/">Domů</NavLink>
          <NavLink to="/about">O nás</NavLink>
          {isAuth && <NavLink to="/secret">Tajemství</NavLink>}
          <NavLink to="/login">Přihlášení</NavLink>
          <NavLink to="/register">Registrace</NavLink>
        </nav>

        <UserStatus />
      </header>

      <main className="main">

        <Outlet />

      </main>

    </>
  )
}

export default App
