import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContainer } from '../components/UI/Card';
import LoginForm from '../components/enitity/forms/LoginForm';

export default function Login() {
	// Inititalisation --------------------------------------------
	const { authState, login } = useAuth();
	// State ------------------------------------------------------
	const [loginMessage, setLoginMessage] = useState('');
	const sessionExpired = new URLSearchParams(location.search).get('sessionExpired') === 'true';

	// Redirect when already logged in
	if(authState.isLoggedIn) {
		return <div>You are logged in.</div>;
	}
	// Handlers ---------------------------------------------------
	const handleLogin = async (data) => {
		setLoginMessage('');
		const response = await login(data);
		if (response.isSuccess) {
			setLoginMessage('Login successful!');
			window.location.href = '/';
		} else {
			setLoginMessage(`Login failed: ${response.message}`);
		}
	};
	// View -------------------------------------------------------
	return (
		<>
			<LoginForm onSubmit={handleLogin} loginMessage = {loginMessage} sessionExpired = {sessionExpired}/>
		</>
	);
}
