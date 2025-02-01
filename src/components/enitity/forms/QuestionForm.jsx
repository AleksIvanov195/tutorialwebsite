import Form from '../../UI/formui/Form';
const QuestionForm = ({ onSubmit, onClose, quiz, initialValues = {}, mode = 'edit' }) =>{
	// Inititalisation --------------------------------------------
	const fields = [
		{
			name: 'QuestionText',
			label: 'Question',
			type: 'text',
			validation: { required: 'Question is required' },
			placeholder: 'Enter your question',
		},
		{
			name: 'QuestionFeedbacktext',
			label: 'Feedback',
			type: 'text',
			validation: { required: 'Feedback is required' },
			placeholder: 'Enter feedback' },
		{
			name: 'QuestionType',
			label: 'Question Type',
			type: 'select',
			options: [
				{ value: 'MultipleChoice', label: 'Multiple Choice' },
				{ value: 'SingleChoice', label: 'Single Choice' },
			],
			validation: { required: 'Question type is required' },
		},

	];
	const defaultValues = {
		QuestionText: '',
		QuestionFeedbacktext: '',
		QuestionType: '',
		QuestionQuizID: quiz.QuizID,
	};
	const initialFormValues = mode === 'edit' ? initialValues : defaultValues;
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	const header = 'Edit Question';
	return <Form fields={fields} defaultValues={initialFormValues} onClose = {onClose} onSubmit={onSubmit} header={header}/>;
};
export default QuestionForm;