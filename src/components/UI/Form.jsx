import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './Buttons';
import './Form.scss';

export default function Form({ fields, defaultValues, onSubmit, onClose, apiResponse, header }) {
	// Inititalisation --------------------------------------------
	const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm({ defaultValues });
	// State ------------------------------------------------------
	// Reset the form when submission is successful
	useEffect(() => {
		if (isSubmitSuccessful) {
			reset(defaultValues);
		}
	}, [isSubmitSuccessful, reset, defaultValues]);
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return (
		<>
			<form className='form' onSubmit={handleSubmit(onSubmit)}>
				{/* Destructring the fields*/}
				{header && <p className="formHeader">{header}</p>}
				{fields.map(({ name, label, type, options, validation, placeholder }) => (
					<div className="formItem" key={name}>
						<label>{label}</label>

						{type === 'select'
							?
							(
								<select {...register(name, validation)}>
									{options.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							)
					 		:
							type === 'textarea' ? (
								<textarea
									{...register(name, validation)}
									placeholder={placeholder}
								></textarea>
							)
						  :
								(
									<input
										type={type}
										{...register(name, validation)}
										placeholder={placeholder}
									/>
								)}
						{errors[name] && <p className="errorMessage">{errors[name]?.message}</p>}
					</div>
				))}
				{apiResponse && <p className="errorMessage">{apiResponse}</p>}
				<Button type="submit">Submit</Button>
				{onClose && <Button onClick={onClose}>Close</Button> }
			</form>
		</>
	);

}
