import {useAuth} from '../context/AuthContext'
import {Outlet} from 'react-router-dom'

export function AuthRoute() {
  const {isAuth} = useAuth()

  if (isAuth) {
    return <Outlet />
  }

  return (
    <p>Sem nemuzes, je to jen pro prihlasene</p>
  );
}

export default AuthRoute;