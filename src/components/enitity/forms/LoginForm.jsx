import Form from '../../UI/formui/Form';

export default function LoginForm({ onSubmit }) {
	// Specify fields with name (match default values), label, type, placeholder, validation
	const fields = [
		{
			name: 'UserEmail',
			label: 'Email',
			type: 'text',
			placeholder: 'Enter your email',
			validation: {
				required: 'Email is required',
				pattern: {
					value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
					message: 'Must be a valid email.',
				},
			},
		},
		{
			name: 'UserPassword',
			label: 'Password',
			type: 'password',
			placeholder: 'Enter your password',
			validation: { required: 'Password is required' },
		},
	];

	const defaultValues = { UserEmail: '', UserPassword: '' };

	const header = 'Log In';

	return <Form
		fields={fields}
		defaultValues={defaultValues}
		onSubmit={onSubmit}
		header={header}
		submitButtonText='Log In'/>;

}
