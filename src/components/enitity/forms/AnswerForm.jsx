import Form from '../../UI/formui/Form';
import useLoad from '../../../api/useLoad';
import toast from 'react-hot-toast';
const AnswerForm = ({ header, onSubmit, onClose, question, mode = 'Edit' }) =>{
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	const [answers, setAnswers, answersMessage, isLoading, loadAnswers ] = useLoad(`/answers?AnswerQuestionID=${question.QuestionID}`);
	// Handlers ---------------------------------------------------
	const handleFormSubmit = (data) => {
		const hasCorrectAnswer = data.answers.some(answer => answer.checked);
		if (!hasCorrectAnswer) {
			toast.error('You must select at least 1 correct answer!');
		}else{
			const currentAnswers = data.answers.map((answer, index) => {
				if (isMultipleChoice) {
					// For multiple choice questions, use the checked value to set the AnswerCorrect
					const { checked, ...rest } = answer;
					return {
						...rest,
						AnswerCorrect: checked,
					};
				} else {
					// For single choice questions use the index of the correct asnwer provided by the radio button to set the AnswerCorrect
					const { checked, ...rest } = answer;
					const isChecked = parseInt(data.answers.checked) === index;
					return {
						...rest,
						AnswerCorrect: isChecked,
					};
				}
			});
			const addedAnswers = currentAnswers.filter(answer => !answer.AnswerID);
			const removedAnswers = answers.filter(originalAnswer => !currentAnswers.some(answer => answer.AnswerID === originalAnswer.AnswerID));
			const updatedAnswers = currentAnswers.filter(answer => answer.AnswerID
				&& answers.some(originalAnswer => originalAnswer.AnswerID === answer.AnswerID
				&& originalAnswer.AnswerText !== answer.AnswerText
				|| originalAnswer.AnswerCorrect !== answer.AnswerCorrect));
			onSubmit({ addedAnswers, removedAnswers, updatedAnswers });
		}

	};

	const transformedAnswers = answers.map(answer => ({
		...answer,
		checked: answer.AnswerCorrect,
	}));
	// View -------------------------------------------------------
	const dynamicField = {
		name: 'answers',
		fieldName: 'AnswerText',
		label: 'Answer',
		placeholder: 'Enter your answer',
		defaultValue: { AnswerText: '', checked: false },
	};
	const isMultipleChoice = question.QuestionType === 'MultipleChoice';
	return(
		<>
			{isLoading ?
				<p>{answersMessage}</p>
				:
				<Form
					defaultValues={{ answers: transformedAnswers }}
					onClose={onClose}
					onSubmit={handleFormSubmit}
					header= {header}
					dynamicFields={dynamicField}
					isMultipleChoice={isMultipleChoice}
					resetOnSubmit = {false}
					submitButtonText='Save Changes'
				/>
			}
		</>

	);


};
export default AnswerForm;