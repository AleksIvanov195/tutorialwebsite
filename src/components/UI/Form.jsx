import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button, ButtonTray } from './Buttons';
import './Form.scss';

export default function Form({ fields, defaultValues, onSubmit, onClose, apiResponse, header, dynamicFields }) {
	// Inititalisation --------------------------------------------
	const { register, handleSubmit, control, formState: { errors, isSubmitSuccessful }, reset } = useForm({ defaultValues });
	const { fields: dynamicFieldArray, append, remove } = useFieldArray({ control, name: dynamicFields?.name });
	// State ------------------------------------------------------
	// Reset the form when submission is successful
	useEffect(() => {
		if (isSubmitSuccessful) {
			reset(defaultValues);
		}
	}, [isSubmitSuccessful, reset, defaultValues]);
	// Handlers ---------------------------------------------------
	const handleAddField = () => {
		append(dynamicFields?.defaultValue);
	};
	// View -------------------------------------------------------
	return (
		<>
			<form className= 'form' onSubmit={handleSubmit(onSubmit)}>
				{/* Destructring the fields*/}
				{header && <p className="formHeader">{header}</p>}
				{fields && fields.map(({ name, label, type, options, validation, placeholder }) => (
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
				{dynamicFields && (
					<>
						{dynamicFieldArray.map((field, index) => (
							<div className="formItem" key={field.id}>
								<label>{`${dynamicFields.label} ${index + 1}`}</label>
								<div className='dynamicInput'>
									<input
										type="text"
										{...register(`${dynamicFields.name}[${index}].${dynamicFields.fieldName}`, { required: 'This field is required' })}
										placeholder={dynamicFields.placeholder}
									/>
									<Button onClick={() => remove(index)}>Remove</Button>
								</div>
							</div>
						))}
						<Button onClick={handleAddField}>Add {dynamicFields.label}</Button>
					</>
				)}
				{apiResponse && <p className="errorMessage">{apiResponse}</p>}
				<ButtonTray>
					<Button type="submit">Submit</Button>
					{onClose && <Button onClick={onClose}>Close</Button> }
				</ButtonTray>
			</form>
		</>
	);

}
