import Form from '../../UI/Form';
const QuizForm = ({ onSubmit, onClose, quizMessage, initialValues = {}, mode = 'create' }) =>{
	// Inititalisation --------------------------------------------
	const fields = [
		{
			name: 'QuizName',
			label: 'Quiz Name',
			type: 'text',
			placeholder: 'Enter quiz name...',
			validation: {
				required: 'Quiz Name is required',
				minLength: { value: 3, message: 'Must be at least 3 characters long' },
			},
		},
		{
			name: 'QuizDescription',
			label: 'Quiz Description',
			type: 'textarea',
			placeholder: 'Enter quiz description',
			validation: {
				required: 'Quiz Description is required',
				minLength: { value: 10, message: 'Must be at least 10 characters long' },
			},
		},
	];
	const defaultValues = {
		QuizName: '',
		QuizDescription: '',
		QuizPublicationstatusID: '1',
	};
	const initialFormValues = mode === 'edit' ? initialValues : defaultValues;
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------

	// View -------------------------------------------------------
	const header = mode === 'edit' ? 'Edit Quiz' : 'Create Quiz';
	return <Form fields={fields} defaultValues={initialFormValues} onClose = {onClose} onSubmit={onSubmit} apiResponse={quizMessage}header={header}/>;
};
export default QuizForm;