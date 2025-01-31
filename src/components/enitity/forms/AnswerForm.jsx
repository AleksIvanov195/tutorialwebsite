import Form from '../../UI/formui/Form';
import useLoad from '../../../api/useLoad';
import { useAuth } from '../../../hooks/useAuth';
const AnswerForm = ({ header, onSubmit, onClose, question, mode = 'Edit' }) =>{
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	// State ------------------------------------------------------
	const [answers, setAnswers, answersMessage, isLoading, loadAnswers ] = useLoad(`/answers?AnswerQuestionID=${question.QuestionID}`, authState.isLoggedIn);
	// Handlers ---------------------------------------------------
	const handleFormSubmit = (data) =>{
		const currentAnswers = data.answers.map(answer => {
			const { checked, ...rest } = answer;
			return {
				...rest,
				AnswerCorrect: checked,
			};
		});
		const addedAnswers = currentAnswers.filter(answer => !answer.AnswerID);
		const removedAnswers = answers.filter(originalAnswer => !currentAnswers.some(answer => answer.AnswerID === originalAnswer.AnswerID));
		const updatedAnswers = currentAnswers.filter(answer => answer.AnswerID
			&& answers.some(originalAnswer => originalAnswer.AnswerID === answer.AnswerID
			&& originalAnswer.AnswerText !== answer.AnswerText
			|| originalAnswer.AnswerCorrect !== answer.AnswerCorrect));
		onSubmit({ addedAnswers, removedAnswers, updatedAnswers });

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
				/>
			}
		</>

	);


};
export default AnswerForm;