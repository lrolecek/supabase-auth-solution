import {useState} from 'react'
import {Link} from 'react-router-dom'

import {useAuth} from '../context/AuthContext'

import {useNavigate} from 'react-router-dom'

export const Login = () => {

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const {login} = useAuth()

	const navigate = useNavigate()

	const handleSubmit = async (e) =>{
		e.preventDefault()
		console.log('Prihlasuji...', email, password)

		const {error} = login(email, password)

		if (error) {
			console.log(error)
			return
		}

		// pokud pri prihlaseni nedoslo k chybe
		// presmeruj na uvodni stranku
		navigate('/')

	}

	return (
		<>
			<h2>Přihlášení</h2>

			<form onSubmit={handleSubmit}>

				<div className="form-field">
					<label>E-mail</label>
					<input
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</div>

				<div className="form-field">
					<label>Password</label>
					<input
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>

				<button type="submit">Přihlásit se</button>

				<p>Ještě nemáš účet? <Link to="/register">Zaregistruj se.</Link></p>
			</form>
		</>
	)
}

export default Login