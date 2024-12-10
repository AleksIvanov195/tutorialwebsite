import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import './Form.scss';

export default function RegisterForm({ onSubmit, registerMessage }) {
	// Inititalisation --------------------------------------------
	const { register, handleSubmit, formState, formState: { errors, isSubmitSuccessful }, reset } = useForm({
		defaultValues: { UserName: '', UserEmail: '', UserPassword: '' },
	});
	// State ------------------------------------------------------
	// Reset the form when submission is successful
	useEffect(() => {
		if (formState.isSubmitSuccessful) {
			reset({ UserName: '', UserEmail: '', UserPassword: '' });
		}
	}, [formState, reset]);
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return (
		<form className="form" onSubmit={handleSubmit(onSubmit)}>
			<div className='formItem'>
				<label>Username</label>
				<input
					{...register('UserName', {
						required: 'Username is required',
						minLength: {
							value: 3,
							message: 'Username must be at least 3 characters long',
						},
					})}
					placeholder="Enter your Username"
				/>
				{errors.CourseName && <p className='errorMessage'>{errors.UserName.message}</p>}
			</div>
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
			{registerMessage && <p className="errorMessage">{registerMessage}</p>}
			<button type="submit">Login</button>
		</form>
	);
}