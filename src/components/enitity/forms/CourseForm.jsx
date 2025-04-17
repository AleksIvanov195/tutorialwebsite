import Form from '../../UI/formui/Form';
import useLoad from '../../../api/useLoad';
export default function CourseForm({ onSubmit, onClose, initialValues = {}, mode = 'create' }) {
	// Inititalisation --------------------------------------------
	const [categories, , categoriesMessage, isLoading] = useLoad('/coursecategories');

	// Specify fields with name (match default values), label, type, placeholder, validation
	const fields = [
		{
			name: 'CourseName',
			label: 'Course Name',
			type: 'text',
			placeholder: 'Enter course name',
			validation: {
				required: 'Course Name is required',
				minLength: { value: 3, message: 'Must be at least 3 characters long' },
			},
		},
		{
			name: 'CourseDescription',
			label: 'Course Description',
			type: 'textarea',
			placeholder: 'Enter course description',
			validation: {
				required: 'Course Description is required',
				minLength: { value: 10, message: 'Must be at least 10 characters long' },
			},
		},
		{
			name: 'CourseCoursecategoryID',
			label: 'Course Category',
			type: 'select',
			options:
			isLoading
				? [{ value: '', label: 'Loading Categories...' }]
				: categories.length > 0
					?
					categories.map((category) => ({
						value: category.CoursecategoryID,
						label: category.CoursecategoryName,
					}))
					: [{ value: '', label: 'No categories available' }],
			validation: { required: 'Course Category is required' },
		},
	];
	if (isLoading) {
		return <div>Loading categories...</div>;
	}
	const defaultValues = {
		CourseName: '',
		CourseDescription: '',
		CourseCoursecategoryID: 1,
		CoursePublicationstatusID: 1,
	};
	const initialFormValues = mode === 'edit' ? initialValues : defaultValues;
	const header = mode === 'edit' ? 'Edit Course' : 'Create Course';
	return <Form
		fields={fields}
		defaultValues={initialFormValues}
		onSubmit={onSubmit}
		header={header}
		onClose = {onClose} />;
}
