import { useState, useEffect } from 'react';
import useLoad from '../../api/useLoad';
import Question from '../../components/enitity/quiz/Question';
import { Button, ButtonTray } from '../../components/UI/Buttons';
import QuestionList from '../../components/enitity/quiz/QuestionList';
import toast from 'react-hot-toast';
import '../../components/enitity/quiz/Quiz.scss';
import QuizEndScreen from '../../components/enitity/quiz/QuizEndScreen';
import { useAuth } from '../../hooks/useAuth';
import useApiActions from '../../hooks/useApiActions';


const Quiz = ({ quizID, isCompleted = false, loadCourseContent }) => {
	// Initialisation --------------------------------------------
	const { authState } = useAuth();
	const { post, put, delete: deleteRequest, batchRequests } = useApiActions();
	// State ------------------------------------------------------
	const [quiz, setQuiz, quizMessage, isQuizLoading, loadQuiz] = useLoad(`/quizzes/${quizID}`);
	const [questionsData, setQuestionsData, questionsMessage, isLoading, loadQuestionsData] = useLoad(`/quizzes/${quizID}/questions-answers?orderby=QuestionOrdernumber,ASC`);

	const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	// Stores the selected answers for the current question
	const [selectedAnswers, setSelectedAnswers] = useState([]);
	// Tracks whether the current question has been submitted
	const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
	// Tracks whether the submitted answer is correct.
	const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
	const [score, setScore] = useState(0);
	const [quizFinished, setQuizFinished] = useState(isCompleted);
	// Stores the correctness of each question.
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
		const currentQuestion = questionsAndAnswers[currentQuestionIndex];
		if (currentQuestion.QuestionType === 'MultipleChoice') {
			// For multiple-choice questions toggle the selected answer
			setSelectedAnswers(prevSelectedAns => {
				if (prevSelectedAns.includes(answerID)) {
					return prevSelectedAns.filter(ansID => ansID !== answerID);
				} else {
					return [...prevSelectedAns, answerID];
				}
			});
		} else {
			// For single choice questions set the selected answer
			setSelectedAnswers([answerID]);
		}
	};

	const handleSubmit = () => {
		// Cannot submit if there aren't any selected answers
		if (selectedAnswers.length > 0) {
			const currentQuestion = questionsAndAnswers[currentQuestionIndex];
			const correctAnswerIDs = currentQuestion.Answers
				.filter((ans) => ans.AnswerCorrect)
				.map((ans) => ans.AnswerID);

			const answersCorrect = currentQuestion.QuestionType === 'MultipleChoice' ?
				arraysMatch(selectedAnswers, correctAnswerIDs)
				: correctAnswerIDs.includes(selectedAnswers[0]);

			setIsQuestionSubmitted(true);
			setIsAnswerCorrect(answersCorrect);

			if (answersCorrect) {
				setScore((previous) => previous + 1);
			}

			// Update the correctAnswers state
			setCorrectAnswers((prev) => {
				const newCorrectAnswers = [...prev];
				// Sets the correctnes of the answer
				newCorrectAnswers[currentQuestionIndex] = answersCorrect;
				return newCorrectAnswers;
			});
		}
	};

	// Handle going to next question
	const handleNext = () => {
		setIsQuestionSubmitted(false);
		setSelectedAnswers([]);
		goToNextQuestion();

	};
	const goToNextQuestion = () => {
		let nextIndex = currentQuestionIndex + 1;
		while (nextIndex < questionsAndAnswers.length && correctAnswers[nextIndex] !== null) {
			nextIndex++;
		}
		if (nextIndex < questionsAndAnswers.length) {
			setCurrentQuestionIndex(nextIndex);
		} else {
			// If no unanswered questions are found, check from the beginning
			nextIndex = correctAnswers.findIndex(answer => answer === null);
			if (nextIndex !== -1) {
				setCurrentQuestionIndex(nextIndex);
			} else {
				toast.success('You have answered all question, click Finish to finish the quiz!');
			}
		}
	};
	// Handle selecting a question from the question list
	const handleQuestionClick = (index) => {
		// if the question was not submitted
		// This ensures that users cannot go back to a question if it was submitted.
		if (correctAnswers[index] === null) {
			setCurrentQuestionIndex(index);
			setIsQuestionSubmitted(false);
			setSelectedAnswers([]);
		}
	};

	const handleFinishQuiz = async () => {
		if(authState.isLoggedIn) {
			const response = await post('/userquizzes', {
				UserquizUsercontentstatusID: 3,
				UserquizCompletiondate: new Date().toISOString().replace('T', ' ').split('.')[0],
				UserquizQuizID: quiz[0].QuizID,
				UserquizResult: score,
			}, {
				successMessage: 'Quiz attempt saved to your progress.',
				errorMessage: 'This quiz attempt could be saved.',
			});
			if(response.isSuccess) {
				loadCourseContent();
			}
		}else{
			toast.error('You must log in to save your quiz progress!');
		}

	};
	const resetQuiz = () => {
		setQuizFinished(false);
		setScore(0);
		setSelectedAnswers([]);
		setCurrentQuestionIndex(0);
		setIsQuestionSubmitted(false);
		setIsAnswerCorrect(null);
		setCorrectAnswers(Array(questionsAndAnswers.length).fill(null));
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
			<QuizEndScreen score = {score} quiz = {quiz[0]} quizLength={questionsAndAnswers.length} resetQuiz={resetQuiz}/>
		);
	}

	const currentQuestion = questionsAndAnswers[currentQuestionIndex];
	const allQuestionsAnswered = correctAnswers.every(answer => answer !== null);
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
				isSubmitted={isQuestionSubmitted}
			/>
			{isQuestionSubmitted && (
				<p className={`feedback ${isAnswerCorrect ? 'correct' : 'wrong'}`}>
					{isAnswerCorrect ? 'Correct!' : `Wrong! ${currentQuestion.QuestionFeedbacktext}`}
				</p>
			)}
			<ButtonTray>
				<Button onClick={handleSubmit} disabled={isQuestionSubmitted || selectedAnswers === null}>Submit</Button>
				{isQuestionSubmitted && (
					<Button onClick={allQuestionsAnswered ? () => {
						handleFinishQuiz();
						setQuizFinished(true);
					}
						:
						handleNext}>
						{allQuestionsAnswered ? 'Finish' : 'Next'}
					</Button>
				)}
			</ButtonTray>
		</div>
	);
};

export default Quiz;

