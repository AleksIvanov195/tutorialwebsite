import { useState, useEffect } from 'react';
import useLoad from '../../api/useLoad';
import Question from '../quizviews/Question';
import { Button, ButtonTray } from '../../components/UI/Buttons';
import QuestionList from '../quizviews/QuestionList';
import '../quizviews/Quiz.scss';

const QuizUserView = ({ quizID }) => {
	// Initialisation --------------------------------------------
	// State ------------------------------------------------------
	const [quiz, setQuiz, quizMessage, isQuizLoading, loadQuiz] = useLoad(`/quizzes/${quizID}`);
	const [questionsData, setQuestionsData, questionsMessage, isLoading, loadQuestionsData] = useLoad(`/quizzes/${quizID}/questions-answers?orderby=QuestionOrdernumber,ASC`);
	const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswers, setSelectedAnswers] = useState([]);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isCorrect, setIsCorrect] = useState(null);
	const [score, setScore] = useState(0);
	const [quizFinished, setQuizFinished] = useState(false);
	const [correctAnswers, setCorrectAnswers] = useState([]);

	useEffect(() => {
		if (questionsData.length > 0) {
			const transformedData = transformQuestionsData();
			setQuestionsAndAnswers(transformedData);
			// Creates a new array with the same length with null values,
			// These null values will be replaced by correctness of each question.
			setCorrectAnswers(Array(transformedData.length).fill(null));
		}
	}, [questionsData]);

	// Handlers ---------------------------------------------------
	const transformQuestionsData = () => {
		const transformedData = questionsData.map(item => ({
			...item,
			Answers: JSON.parse(item.Answers),
		}));
		// Follow the question order
		const sortedQuestionsAndAnswers = Object.values(transformedData).sort((a, b) => a.QuestionOrdernumber - b.QuestionOrdernumber);
		return sortedQuestionsAndAnswers;
	};

	// Handle selecting answers in the Question component
	const handleSelectAnswer = (answerID) => {
		setSelectedAnswers(prevSelectedAns => {
			if (prevSelectedAns.includes(answerID)) {
				return prevSelectedAns.filter(ansID => ansID !== answerID);
			} else {
				return [...prevSelectedAns, answerID];
			}
		});
	};

	const handleSubmit = () => {
		// Cannot submit if there aren't any selected answers
		if (selectedAnswers.length > 0) {
			const currentQuestion = questionsAndAnswers[currentQuestionIndex];
			const correctAnswerIDs = currentQuestion.Answers
				.filter((ans) => ans.AnswerCorrect)
				.map((ans) => ans.AnswerID);

			const isAnswerCorrect = currentQuestion.QuestionType === 'MultipleChoice' ?
				arraysMatch(selectedAnswers, correctAnswerIDs)
				: correctAnswerIDs.includes(selectedAnswers[0]);

			setIsSubmitted(true);
			setIsCorrect(isAnswerCorrect);

			if (isAnswerCorrect) {
				setScore((previous) => previous + 1);
			}

			// Update the correctAnswers state
			setCorrectAnswers((prev) => {
				const newCorrectAnswers = [...prev];
				// Sets the correctnes of the answer
				newCorrectAnswers[currentQuestionIndex] = isAnswerCorrect;
				return newCorrectAnswers;
			});
		}
	};

	// Handle going to next question
	const handleNext = () => {
		setIsSubmitted(false);
		setSelectedAnswers([]);
		if (currentQuestionIndex < questionsAndAnswers.length - 1) {
			setCurrentQuestionIndex(previous => previous + 1);
		} else {
			setQuizFinished(true);
		}
	};

	// Handle selecting a question from the question list
	const handleQuestionClick = (index) => {
		// If the select question index is bigger than current question or if the question was not submitted
		// This ensures that users cannot go back to previous question, if it was submitted.
		if (index > currentQuestionIndex || correctAnswers[index] === null) {
			setCurrentQuestionIndex(index);
			setIsSubmitted(false);
			setSelectedAnswers([]);
		}
	};

	const arraysMatch = (arr1, arr2) => {
		if (arr1.length !== arr2.length) return false;
		const sortedA = [...arr1].sort();
		const sortedB = [...arr2].sort();
		return sortedA.every((value, index) => value === sortedB[index]);
	};

	// ...existing code...

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
			<QuestionList
				questions={questionsAndAnswers}
				currentQuestionIndex={currentQuestionIndex}
				onQuestionClick={handleQuestionClick}
				correctAnswers={correctAnswers}
			/>
			<h2 className="quizHeader">Question {currentQuestionIndex + 1}:</h2>
			<Question
				question={currentQuestion}
				selectedAnswers={selectedAnswers}
				onSelectAnswer={handleSelectAnswer}
				isSubmitted={isSubmitted}
			/>
			{isSubmitted && (
				<p className={`feedback ${isCorrect ? 'correct' : 'wrong'}`}>
					{isCorrect ? 'Correct!' : `Wrong! ${currentQuestion.QuestionText}`}
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

export default QuizUserView;

