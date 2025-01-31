import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/enitity/forms/RegisterForm';
import toast from 'react-hot-toast';

export default function Register() {
	// Inititalisation --------------------------------------------
	const { authState, register } = useAuth();
	// State ------------------------------------------------------
	// Redirect when already logged in
	if(authState.isLoggedIn) {
		return <div>You are logged in.</div>;
	}
	// Handlers ---------------------------------------------------
	const handleRegister = async (data) => {
		const toastId = toast.loading('Registering...');
		const response = await register(data);
		if (response.isSuccess) {
			window.location.href = '/';
			toast.success('Successfully Registered!', { id:toastId });
		} else {
			toast.error(`Registering Failed! ${response.message}`, { id:toastId });
		}
	};
	// View -------------------------------------------------------
	return (
		<>
		 <RegisterForm onSubmit={handleRegister}/>
		</>
	);
}