import {useAuth} from '../context/AuthContext'

import {useNavigate} from 'react-router-dom'


export function UserStatus() {

	const {user, isAuth, logout} = useAuth()
	const navigate = useNavigate()

	return (
		<div className="user-status">

			{isAuth
				? <>
						<p>Přihlášený: {user.user_metadata.firstName} {user.user_metadata.lastName}</p>
						<button onClick={logout}>Odhlásit</button>
					</>
				: <>
						<p>Neni prihlaseny</p>
						<button onClick={() => {navigate('/login')}}>Přihlásit</button>
					</>
			}

		</div>
	);
}

export default UserStatus;