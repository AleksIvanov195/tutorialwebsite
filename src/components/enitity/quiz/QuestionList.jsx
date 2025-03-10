import './QuestionList.scss';

const QuestionList = ({ questions, currentQuestionIndex, onQuestionClick, correctAnswers }) => {
	return (
		<div className="questionList">
			{questions.map((question, index) => (
				<div
					key={index}
					className={`questionItem ${index === currentQuestionIndex ? 'active' : ''} ${correctAnswers[index] !== null ? (correctAnswers[index] ? 'correct' : 'wrong') : ''}`}
					onClick={() => onQuestionClick(index)}
				>
					{index + 1}
				</div>
			))}
		</div>
	);
};

export default QuestionList;