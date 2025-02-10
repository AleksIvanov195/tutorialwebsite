import { useFieldArray } from 'react-hook-form';
import { Button } from '../Buttons';
import Icons from '../Icons';

export default function DynamicFields({ control, register, dynamicFields, isMultipleChoice }) {
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
						{isMultipleChoice ? (
							<input
								type="checkbox"
								{...register(`${dynamicFields.name}[${index}].checked`)}
							/>
						) : (
							<input
								type="radio"
								{...register(`${dynamicFields.name}.checked`)}
								value={index}
								defaultChecked={field.checked}
							/>
						)}
						<Button onClick={() => remove(index)} className={'formButton removeButton'} icon={<Icons.Delete />} title = 'Remove Item'/>
					</div>
				</div>
			))}
			<Button onClick={handleAddField} className={'formButton addButton'} icon={<Icons.Add />} />
		</>
	);
}