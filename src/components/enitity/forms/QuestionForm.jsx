import Form from '../../UI/formui/Form';
const QuestionForm = ({ onSubmit, onClose, questionMessage, quiz, initialValues = {}, mode = 'edit' }) =>{
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
	];
	const defaultValues = {
		QuestionText: '',
		QuestionFeedbacktext: '',
		QuestionQuizID: quiz.QuizID,
	};
	const initialFormValues = mode === 'edit' ? initialValues : defaultValues;
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	const header = mode === 'edit' ? 'Edit Quiz' : 'Create Quiz';
	return <Form fields={fields} defaultValues={initialFormValues} onClose = {onClose} onSubmit={onSubmit} apiResponse={questionMessage}header={header}/>;
};
export default QuestionForm;