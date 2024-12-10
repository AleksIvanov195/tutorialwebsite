import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/enitity/forms/RegisterForm';

export default function Register() {
	// Inititalisation --------------------------------------------
	const { authState, register } = useAuth();
	// State ------------------------------------------------------
	const [registerMessage, setRegisterMessage] = useState('');
	// Redirect when already logged in
	if(authState.isLoggedIn) {
		return <div>You are logged in.</div>;
	}
	// Handlers ---------------------------------------------------
	const handleRegister= async (data) => {
		setRegisterMessage('');
		const response = await register(data);
		if (response.isSuccess) {
			setRegisterMessage('Registersuccessful!');
			window.location.href = '/';
		} else {
			setRegisterMessage(`Registerfailed: ${response.message}`);
		}
	};
	// View -------------------------------------------------------
	return (
		<>
		 <RegisterForm onSubmit={handleRegister} registerMessage = {registerMessage}/>
		</>
	)
}