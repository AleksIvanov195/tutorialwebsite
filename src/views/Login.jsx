import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/enitity/forms/LoginForm';
import toast from 'react-hot-toast';
export default function Login() {
	// Inititalisation --------------------------------------------
	const { authState, login } = useAuth();
	// State ------------------------------------------------------
	const sessionExpired = new URLSearchParams(location.search).get('sessionExpired') === 'true';

	// Redirect when already logged in
	if(authState.isLoggedIn) {
		return <div>You are logged in.</div>;
	}
	// Handlers ---------------------------------------------------
	const handleLogin = async (data) => {
		const toastId = toast.loading('Logging in...');
		const response = await login(data);
		if (response.isSuccess) {
			window.location.href = '/';
			toast.success('Log in Successful!', { id:toastId });
		} else {
			toast.error(`Log in Failed! ${response.message}`, { id:toastId });
		}
	};
	// View -------------------------------------------------------
	return (
		<>
			<LoginForm onSubmit={handleLogin} sessionExpired = {sessionExpired}/>
		</>
	);
}
