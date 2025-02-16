import { useState, useEffect } from 'react';
import useLoad from '../../api/useLoad';
import Question from './Question';
import { Button, ButtonTray } from '../../components/UI/Buttons';
import './Quiz.scss';

const Quiz = () => {
	// Initialisation --------------------------------------------
	const quizID = sessionStorage.getItem('previewQuizID');
	// State ------------------------------------------------------
	const [quiz, setQuiz, quizMessage, isQuizLoading, loadQuiz] = useLoad(`/quizzes/${quizID}`);
	const [questionsData, setQuestionsData, questionsMessage, isLoading, loadQuestionsData] = useLoad(`/quizzes/${quizID}/questions-answers`);

	const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswers, setSelectedAnswers] = useState([]);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isCorrect, setIsCorrect] = useState(null);
	const [score, setScore] = useState(0);
	const [quizFinished, setQuizFinished] = useState(false);

	useEffect(() => {
		if (questionsData.length > 0) {
			const questionAndAnswers = Object.values(breakDownQuestionsData());
			setQuestionsAndAnswers(questionAndAnswers);
		}
	}, [questionsData]);

	// Handlers ---------------------------------------------------
	const breakDownQuestionsData = () => {
		const questionAndAnswers = {};
		questionsData.forEach((item) => {
			if (!questionAndAnswers[item.QuestionID]) {
				questionAndAnswers[item.QuestionID] = {
					questionID: item.QuestionID,
					question: item.QuestionText,
					type: item.QuestionType,
					feedback: item.QuestionFeedbacktext,
					answers: [],
				};
			}
			questionAndAnswers[item.QuestionID].answers.push({
				answerID: item.AnswerID,
				text: item.AnswerText,
				correct: item.AnswerCorrect,
			});
		});
		return questionAndAnswers;
	};

	const handleSelectAnswer = (answerID) => {
		setSelectedAnswers(prevSelected => {
			if (prevSelected.includes(answerID)) {
				return prevSelected.filter(ansID => ansID !== answerID);
			} else {
				return [...prevSelected, answerID];
			}
		});
	};

	const handleSubmit = () => {
		if (selectedAnswers.length > 0) {
			const currentQuestion = questionsAndAnswers[currentQuestionIndex];
			const correctAnswerIDs = currentQuestion.answers
				.filter((ans) => ans.correct)
				.map((ans) => ans.answerID);

			const isAnswerCorrect = currentQuestion.type === 'MultipleChoice' ?
				arraysMatch(selectedAnswers, correctAnswerIDs)
				: correctAnswerIDs.includes(selectedAnswers[0]);

			setIsSubmitted(true);
			setIsCorrect(isAnswerCorrect);

			if (isAnswerCorrect) {
				setScore((previous) => previous + 1);
			}
		}
	};

	const handleNext = () => {
		setIsSubmitted(false);
		setSelectedAnswers([]);
		if (currentQuestionIndex < questionsAndAnswers.length - 1) {
			setCurrentQuestionIndex(previous => previous + 1);
		} else {
			setQuizFinished(true);
		}
	};

	const arraysMatch = (arr1, arr2) => {
		if (arr1.length !== arr2.length) return false;
		const sortedA = [...arr1].sort();
		const sortedB = [...arr2].sort();
		return sortedA.every((value, index) => value === sortedB[index]);
	};

	// View -------------------------------------------------------
	if (isLoading || isQuizLoading) return <p>Loading...</p>;
	if (questionsAndAnswers.length === 0) return <p>No questions available.</p>;

	if (quizFinished) {
		return (
			<div className="quizContainer">
				<h2>You completed {quiz[0].QuizName}!</h2>
				<p>Your final score: {score} / {questionsAndAnswers.length}</p>
				<Button onClick={() => window.location.reload()}>Restart Quiz</Button>
			</div>
		);
	}

	const currentQuestion = questionsAndAnswers[currentQuestionIndex];

	return (
		<div className="quizContainer">
			<h2 className="quizHeader">Question {currentQuestionIndex + 1}:</h2>
			<Question
				question={currentQuestion}
				selectedAnswers={selectedAnswers}
				onSelectAnswer={handleSelectAnswer}
				isSubmitted={isSubmitted}
			/>
			{isSubmitted && (
				<p className={`feedback ${isCorrect ? 'correct' : 'wrong'}`}>
					{isCorrect ? 'Correct!' : `Wrong! ${currentQuestion.feedback}`}
				</p>
			)}
			<ButtonTray>
				<Button onClick={handleSubmit} disabled={isSubmitted || selectedAnswers === null}>Submit</Button>
				{isSubmitted && (
					<Button onClick={handleNext}>
						{currentQuestionIndex < questionsAndAnswers.length - 1 ? 'Next' : 'Finish'}
					</Button>
				)}
			</ButtonTray>
		</div>
	);
};

export default Quiz;