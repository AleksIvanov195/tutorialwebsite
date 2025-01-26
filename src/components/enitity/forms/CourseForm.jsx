import Form from '../../UI/formui/Form';
import useLoad from '../../../api/useLoad';
import { useAuth } from '../../../hooks/useAuth';
export default function CourseForm({ onSubmit, courseMessage }) {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	const [categories, , categoriesMessage, isLoading] = useLoad('/coursecategory', authState.isLoggedIn);

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
		{
			name: 'CoursePublicationstatusID',
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
		CourseCoursecategoryID: '',
		CoursePublicationstatusID: '',
	};

	const header = 'Create Course';

	return <Form fields={fields} defaultValues={defaultValues} onSubmit={onSubmit} apiResponse={courseMessage} header={header} />;
}
