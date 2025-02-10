import Icons from '../../components/UI/Icons';
import './Quiz.scss';

const Answer = ({ answer, questionType, isSelected, onSelectAnswer, isSubmitted }) => {
	return (
		<label className="answer">
			<input
				type={questionType === 'MultipleChoice' ? 'checkbox' : 'radio'}
				name="answer"
				value={answer.answerID}
				checked={isSelected}
				onChange={() => onSelectAnswer(answer.answerID)}
				disabled={isSubmitted}
			/>
			{answer.text}
			{isSubmitted && (answer.correct === 1 ? <Icons.Check color="green" /> : <Icons.Close color="red" />)}
		</label>
	);
};

export default Answer;