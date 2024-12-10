import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import './Form.scss';

export default function LoginForm({ onSubmit, loginMessage, sessionExpired }) {
	// Inititalisation --------------------------------------------
	const { register, handleSubmit, formState, formState: { errors, isSubmitSuccessful }, reset } = useForm({
		defaultValues: { UserEmail: '', UserPassword: '' },
	});
	// State ------------------------------------------------------
	// Reset the form when submission is successful
	useEffect(() => {
		if (formState.isSubmitSuccessful) {
			reset({ UserEmail: '', UserPassword: '' });
		}
	}, [formState, reset]);
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return (
		<form className="form" onSubmit={handleSubmit(onSubmit)}>
			{sessionExpired && (
				<div>
					<p className="errorMessage">Your session has expired. Please log in again.</p>
				</div>
			)}
			<div className='formItem'>
				<label>Email</label>
				<input
					{...register('UserEmail', {
						required: 'Email is required',
						pattern: {
							value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
							message: 'Must be a valid email.',
						},
					})}
					placeholder="Enter your email"
				/>
				{errors.UserEmail && <p className="errorMessage">{errors.UserEmail.message}</p>}
			</div>
			<div className="formItem">
				<label>Password</label>
				<input
					type="password"
					{...register('UserPassword', { required: 'Password is required' })}
					placeholder="Enter your password"
				/>
				{errors.UserPassword && <p className="errorMessage">{errors.UserPassword.message}</p>}
			</div>
			{loginMessage && <p className="errorMessage">{loginMessage}</p>}
			<button type="submit">Login</button>
		</form>
	);
}