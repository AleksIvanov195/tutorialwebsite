import Form from '../../UI/Form';
export default function CourseForm({ onSubmit }) {
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
			name: 'CourseCategory',
			label: 'Course Category',
			type: 'select',
			options: [
				{ value: '', label: 'Select a category' },
				{ value: 'Web Development', label: 'Web Development' },
				{ value: 'Backend Development', label: 'Backend Development' },
				{ value: 'Programming', label: 'Programming' },
				{ value: 'Web Design', label: 'Web Design' },
			],
			validation: { required: 'Course Category is required' },
		},
		{
			name: 'CoursePublicationStatusID',
			label: 'Course Publication',
			type: 'select',
			options: [
				{ value: '', label: 'Select a status' },
				{ value: 1, label: 'Draft' },
				{ value: 2, label: 'Submit for Review' },
				{ value: 4, label: 'Publish' },
			],
			validation: { required: 'Course Publication is required' },
		},
	];

	const defaultValues = {
		CourseName: '',
		CourseDescription: '',
		CourseCategory: '',
		CoursePublicationStatusID: '',
	};

	return <Form fields={fields} defaultValues={defaultValues} onSubmit={onSubmit} />;
}
