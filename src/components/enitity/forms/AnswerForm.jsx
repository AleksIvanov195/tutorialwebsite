import Form from '../../UI/Form';
import useLoad from '../../../api/useLoad';
import { useAuth } from '../../../hooks/useAuth';
const AnswerForm = ({ onSubmit, onClose, answerMessage, question, mode = 'Edit' }) =>{
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	// State ------------------------------------------------------
	const [answers, setAnswers, , isLoading, loadAnswers ] = useLoad(`/answers?AnswerQuestionID=${question.QuestionID}`, authState.isLoggedIn);

	// Handlers ---------------------------------------------------
	const handleFormSubmit = (data) =>{
		const currentAnswers = data.answers;
		const addedAnswers = currentAnswers.filter(answer => !answer.AnswerID);
		const removedAnswers = answers.filter(originalAnswer => !currentAnswers.some(answer => answer.AnswerID === originalAnswer.AnswerID));
		const updatedAnswers = currentAnswers.filter(answer => answer.AnswerID && answers.some(originalAnswer => originalAnswer.AnswerID === answer.AnswerID && originalAnswer.AnswerText !== answer.AnswerText));
		onSubmit({ addedAnswers, removedAnswers, updatedAnswers });

	};
	// View -------------------------------------------------------
	const dynamicField = {
		name: 'answers',
		fieldName: 'AnswerText',
		label: 'Answer',
		placeholder: 'Enter your answer',
		defaultValue: { AnswerText: '' },
	};
	return(
		<>
			{isLoading ?
				<p>Loading</p>
				:
				<Form
					defaultValues={{ answers }}
					onClose={onClose}
					onSubmit={handleFormSubmit}
					apiResponse={answerMessage}
					header='Edit Answers'
					dynamicFields={dynamicField}
				/>
			}
		</>

	);


};
export default AnswerForm;