import Answer from './Answer';
import './Quiz.scss';

const Question = ({ question, selectedAnswers, onSelectAnswer, isSubmitted }) => {
	return (
		<div className="question">
			<p className="questionText">{question.question}</p>
			<div className="answers">
				{question.answers.map((answer) => (
					<Answer
						key={answer.answerID}
						answer={answer}
						questionType={question.type}
						isSelected={selectedAnswers.includes(answer.answerID)}
						onSelectAnswer={onSelectAnswer}
						isSubmitted={isSubmitted}
					/>
				))}
			</div>
		</div>
	);
};

export default Question;