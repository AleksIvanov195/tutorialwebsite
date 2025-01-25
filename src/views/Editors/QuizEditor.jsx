import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import useLoad from '../../api/useLoad';
import API from '../../api/API';
import { ContentPanel, ContentItem } from '../../components/UI/ContentPanel';
import { Button, ButtonTray } from '../../components/UI/Buttons';
import QuestionForm from '../../components/enitity/forms/QuestionForm';
import AnswerForm from '../../components/enitity/forms/AnswerForm';
import './QuizEditor.scss';
import Icons from '../../components/UI/Icons';

const QuizEditor = () => {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	const location = useLocation();
	const { quizID } = location.state || { quizID: null };
	// State ------------------------------------------------------
	const [questions, setQuestions, , isLoading, loadQuestions ] = useLoad(`/questions?QuestionQuizID=${1}`, authState.isLoggedIn);
	const [selectedQuestion, setSelectedQuestion] = useState(null);
	const [formType, setFormType] = useState(null);
	// Handlers ---------------------------------------------------
	const handleItemClick = (question) => {
		setSelectedQuestion(question);
	};
	const handleEditDetails = () => {
		setFormType('details');
	};

	const handleEditAnswers = () => {
		setFormType('answers');
	};

	const handleAddQuestion = async () => {
		const newQuestion = {
			QuestionText: `Question ${questions.length + 1}`,
			QuestionFeedbacktext: 'No Feedback',
			QuestionQuizID: 1,
		};
		const response = await API.post('/questions', newQuestion, authState.isLoggedIn);
		if(response.isSuccess) {
			loadQuestions();
			setSelectedQuestion(response.result.data);
		}
	};
	const handleEditQuestion = async (data) => {
		const response = await API.put(`/questions/${selectedQuestion.QuestionID}`, data, authState.isLoggedIn);
		if(response.isSuccess) {
			loadQuestions();
			setSelectedQuestion(response.result.data);
		}
	};
	const handleDeleteQuestion = async () => {
		// Delete
	};

	const handleSubmitAnswers = async ({ addedAnswers, removedAnswers, updatedAnswers, loadAnswers }) =>{
		for (const answer of addedAnswers) {
			await API.post('/answers', { ...answer, AnswerQuestionID: selectedQuestion.QuestionID }, authState.isLoggedIn);
		}
		for (const answer of removedAnswers) {
			await API.delete(`/answers/${answer.AnswerID}`, authState.isLoggedIn);
		}
		for (const answer of updatedAnswers) {
			await API.put(`/answers/${answer.AnswerID}`, answer, authState.isLoggedIn);
		}
		setSelectedQuestion(null);
	};

	// View -------------------------------------------------------
	return (
		<div className="quizEditor">
			<header className="quizEditorHeader">
				<h1>Quiz Editor</h1>
			</header>
			<div className="quizEditorBody">
				<ContentPanel title="List of Questions">
					<ButtonTray>
						<Button icon = {<Icons.Add size = {25}/>} onClick={handleAddQuestion} title = "Add new question"/>
						<Button icon = {<Icons.Reorder size = {25}/>}onClick={handleAddQuestion} title = "Reorder questions"/>
					</ButtonTray>
					{questions.map((question) => (
						<ContentItem
							key={question.QuestionID}
							title={question.QuestionText}
							onClick={() => handleItemClick(question)}
							isSelected={selectedQuestion?.QuestionID === question.QuestionID}
						>
							<span className="option" onClick={handleEditDetails}><Icons.Edit/>Edit Question Details</span>
							<span className="option" onClick={handleEditAnswers}><Icons.Edit/>Edit Question Answers</span>
							<span className="option delete" onClick={handleEditAnswers}><Icons.Delete/>Delete Question</span>
						</ContentItem>
					))}
					<ButtonTray>
						<Button icon = {<Icons.Add size = {25}/>} onClick={handleAddQuestion} title = "Add new question"/>
						<Button icon = {<Icons.Reorder size = {25}/>}onClick={handleAddQuestion} title = "Reorder questions"/>
					</ButtonTray>
				</ContentPanel>
				<div className={'quizEditorContent'}>
					<div className={`quizEditorForm ${selectedQuestion ? 'show' : ''}`}>
						{selectedQuestion && formType === 'details' && (
							<QuestionForm
								 key={`${selectedQuestion.QuestionID}details`}
								 initialValues={selectedQuestion}
								 onSubmit={handleEditQuestion}
								 onClose={() => {
										 setSelectedQuestion(null);
										 setFormType(null);
								 }}
								 questionMessage={null}
								 quiz={{ QuizID: quizID }}
						 />
						)}
						{selectedQuestion && formType === 'answers' && (
							<AnswerForm
									 key={`${selectedQuestion.QuestionID}-answers`}
									 question={selectedQuestion}
									 onSubmit={handleSubmitAnswers}
									 onClose={() => {
											 setSelectedQuestion(null);
											 setFormType(null);
									 }}
									 answerMessage={null}
									 mode="edit"
							 />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuizEditor;