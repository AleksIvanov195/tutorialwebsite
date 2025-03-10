import Icons from '../../UI/Icons';
import './Quiz.scss';

const Answer = ({ answer, questionType, isSelected, onSelectAnswer, isSubmitted }) => {
	return (
		<label className="answer">
			<input
				type={questionType === 'MultipleChoice' ? 'checkbox' : 'radio'}
				name="answer"
				value={answer.AnswerID}
				checked={isSelected}
				onChange={() => onSelectAnswer(answer.AnswerID)}
				disabled={isSubmitted}
			/>
			{answer.AnswerText}
			{isSubmitted && (answer.AnswerCorrect === 1 ? <Icons.Check color="green" /> : <Icons.Close color="red" />)}
		</label>
	);
};

export default Answer;