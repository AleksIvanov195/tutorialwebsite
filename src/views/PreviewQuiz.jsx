import { useState, useEffect } from 'react';
import useLoad from '../api/useLoad';
import { useAuth } from '../hooks/useAuth';
import { Button, ButtonTray } from '../components/UI/Buttons';
import Icons from '../components/UI/Icons';
import './PreviewQuiz.scss';

const PreviewQuiz = () => {
	// Initialisation --------------------------------------------
	const quizID = sessionStorage.getItem('previewQuizID');
	const { authState } = useAuth();
	// State ------------------------------------------------------
	const [quiz, setQuiz, quizMessage, isQuizLoading, loadQuiz] = useLoad(`/quizzes?QuizID=${quizID}`, authState.isLoggedIn);
	const [questionsData, setQuestionsData, questionsMessage, isLoading, loadQuestionsData] = useLoad(`/quizzes/${quizID}/questions-answers`, authState.isLoggedIn);

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
				<h2>You completed the QUIZ!</h2>
				<p>Your final score: {score} / {questionsAndAnswers.length}</p>
				<Button onClick={() => window.location.reload()}>Restart Quiz</Button>
			</div>
		);
	}
	const currentQuestion = questionsAndAnswers[currentQuestionIndex];
	return (
		<div className="quizContainer">
			<h2 className="quizHeader">Question {currentQuestionIndex + 1}:</h2>
			<p className="questionText">{currentQuestion.question}</p>
			<div className="answers">
				{currentQuestion.answers.map((answer) => (
					<label key={answer.answerID} className="answer">
						<input
							type={currentQuestion.type === 'MultipleChoice' ? 'checkbox' : 'radio'}
							name="answer"
							value={answer.answerID}
							checked={selectedAnswers.includes(answer.answerID)}
							onChange={() => handleSelectAnswer(answer.answerID)}
							disabled={isSubmitted}
						/>
						{answer.text}
						{isSubmitted && (answer.correct === 1 ? <Icons.Check color="green" /> : <Icons.Close color="red" />)}
					</label>
				))}
			</div>
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

export default PreviewQuiz;
