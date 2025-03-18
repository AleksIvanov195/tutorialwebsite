import { useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import useLoad from '../../../api/useLoad';
import { Button } from '../../UI/Buttons';
import { useReward } from 'react-rewards';
import './Quiz.scss';

const QuizEndScreen = ({ score, quiz, quizLength, resetQuiz }) => {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	const { reward: confettiReward, isAnimating: isConfettiAnimating } = useReward('confettiReward', 'confetti', {
		elementCount: 200,
		spread: 130,
		angle: 90,
		lifetime:400,
	});
	// State ------------------------------------------------------
	const [quizUserData,,, isQuizUserDataLoading] = useLoad(`/userquizzes/users?UserquizQuizID=${quiz.QuizID}&orderby=UserquizResult,DESC`, authState.isLoggedIn);
	// When component mounts do confetti
	useEffect(() => {
		confettiReward();
	}, []);
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	const showHistory = () => {
		if (!authState.isLoggedIn) {
			return <p>You need to login to record your history</p>;
		}
		if (isQuizUserDataLoading) {
			return <p>Loading history....</p>;
		}
		if (!quizUserData || quizUserData.length === 0) {
			return <p>No history available</p>;
		}
		return (
			<ul className="completionList">
				{quizUserData.map(data => (
					<li key={data.UserquizID} className="quizResultItem">
						<p>Score: {data.UserquizResult}/{quizLength}</p>
						<p>Completed On: {new Date(data.UserquizCompletiondate).toLocaleString()}</p>
					</li>
				))}
			</ul>
		);
	};
	return (
		<div className="quizContainer">
			<div id="confettiReward" className="questionText" />
			<h2 className="quizHeader">Congratulations! {quiz.QuizName} is finished!</h2>
			<p className="questionText">Your best score: {quizUserData && quizUserData.length > 0 ? quizUserData[0].UserquizResult : score} / {quizLength}</p>
			<p><strong>History of Completions:</strong></p>
			{showHistory()}
			<Button onClick={() => resetQuiz()}>Try Again</Button>
		</div>
	);
};

export default QuizEndScreen;