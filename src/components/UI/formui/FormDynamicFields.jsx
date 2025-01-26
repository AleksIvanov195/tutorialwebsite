import { useFieldArray } from 'react-hook-form';
import { Button } from '../Buttons';

export default function DynamicFields({ control, register, dynamicFields }) {
	const { fields: dynamicFieldArray, append, remove } = useFieldArray({ control, name: dynamicFields.name });

	const handleAddField = () => {
		append(dynamicFields.defaultValue);
	};

	return (
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
	);
}