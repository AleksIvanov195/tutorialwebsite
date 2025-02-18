import Answer from './Answer';
import './Quiz.scss';

const Question = ({ question, selectedAnswers, onSelectAnswer, isSubmitted }) => {
	return (
		<div className="question">
			<p className="questionText">{question.QuestionText}</p>
			<div className="answers">
				{question.Answers.map((answer) => (
					<Answer
						key={answer.AnswerID}
						answer={answer}
						questionType={question.QuestionType}
						isSelected={selectedAnswers.includes(answer.AnswerID)}
						onSelectAnswer={onSelectAnswer}
						isSubmitted={isSubmitted}
					/>
				))}
			</div>
		</div>
	);
};

export default Question;