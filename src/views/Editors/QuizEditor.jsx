import { useState, useRef } from 'react';
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
import Animate from '../../components/UI/Animate';
import DndContext from '../../components/UI/dnd/DndContext';
import SortableItem from '../../components/UI/dnd/SortableItem';
import handleDragEnd from '../../components/UI/dnd/handleDragEnd';
import HoverMenu from '../../components/UI/HoverMenu';

const QuizEditor = () => {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	const location = useLocation();
	const { quizID, quizName } = location.state || { quizID: null, quizName: null };
	// State ------------------------------------------------------
	const [questions, setQuestions, questionsMessage, isLoading, loadQuestions] = useLoad(`/questions?QuestionQuizID=${quizID}&orderby=QuestionOrdernumber,ASC`, authState.isLoggedIn);
	const [selectedQuestion, setSelectedQuestion] = useState(null);
	const [formType, setFormType] = useState(null);
	const [updateMessage, setUpdateMessage] = useState('');
	const [isReordering, setIsReordering] = useState(false);
	const initialQuestions = useRef([]);
	console.log(quizName)
	// Handlers ---------------------------------------------------
	const handleItemClick = (question) => {
		setUpdateMessage('');
		setSelectedQuestion(question);
		setFormType(null);
	};
	const handleEditDetails = () => {
		setUpdateMessage('');
		setFormType('details');
	};

	const handleEditAnswers = () => {
		setUpdateMessage('');
		setFormType('answers');
	};
	const handleQuestionDisplay = () =>{
		setSelected
	}

	const handleAddQuestion = async () => {
		const newQuestion = {
			QuestionText: `Question ${questions.length + 1}`,
			QuestionFeedbacktext: 'No Feedback',
			QuestionOrdernumber: questions.length + 1,
			QuestionQuizID: quizID,
		};
		const response = await API.post('/questions', newQuestion, authState.isLoggedIn);
		if (response.isSuccess) {
			loadQuestions();
			setSelectedQuestion(response.result.data);
		} else {
			alert('Question could not be added, please try again!');
		}
	};
	const handleEditQuestion = async (data) => {
		const response = await API.put(`/questions/${selectedQuestion.QuestionID}`, data, authState.isLoggedIn);
		if (response.isSuccess) {
			loadQuestions();
			setSelectedQuestion(response.result.data);
		} else {
			setUpdateMessage(`Question Update failed: ${response.message}`);
		}
	};
	const handleDeleteQuestion = async () => {
		const response = await API.delete(`/questions/${selectedQuestion.QuestionID}`, authState.isLoggedIn);
		if (response.isSuccess) {
			loadQuestions();
			setSelectedQuestion(response.result.data);
		} else {
			alert('Question could not be deleted, please try again!');
		}
	};

	const handleSubmitReorderedQuestions = async () => {
		try{
			await Promise.all(
				questions.map((question, index) =>
					API.put(`/questions/${question.QuestionID}`, { QuestionOrdernumber: index + 1 }, authState.isLoggedIn),
				),
			);
			setIsReordering(false);
			loadQuestions();
		}catch (error) {
			setIsReordering(false);
			alert('Something went wrong while reordering, please try again!', error);
		}

	};
	const handleSubmitAnswers = async ({ addedAnswers, removedAnswers, updatedAnswers }) => {
		let response = '';
		for (const answer of addedAnswers) {
			response = await API.post('/answers', { ...answer, AnswerQuestionID: selectedQuestion.QuestionID }, authState.isLoggedIn);
		}
		for (const answer of removedAnswers) {
			response = await API.delete(`/answers/${answer.AnswerID}`, authState.isLoggedIn);
		}
		for (const answer of updatedAnswers) {
			response = await API.put(`/answers/${answer.AnswerID}`, answer, authState.isLoggedIn);
		}
		if (response.isSuccess || response === '') {
			setSelectedQuestion(null);
		} else {
			setUpdateMessage(`Answers Update failed: ${response.message}`);
		}
	};

	const toggleReordering = () => {
		if (isReordering) {
			// Revert to initial order if reordering is canceled
			setQuestions(initialQuestions.current);
		} else {
			// Store the initial order before reordering
			initialQuestions.current = questions;
		}
		setIsReordering(!isReordering);
	};

	// View -------------------------------------------------------
	return (
		<>
			{
				isLoading ?
					<p>{questionsMessage}</p>
					:
					<div className="quizEditor">
						<header className="quizEditorHeader">
							<h1>{quizName}</h1>
						</header>
						<div className="quizEditorBody">
							{isReordering ? (
								<DndContext items={questions} onDragEnd={(event) => handleDragEnd(event, questions, setQuestions, 'QuestionID')} idField="QuestionID" >
									<ContentPanel title={isReordering ? 'Reordering Enabled' : 'List of Questions'}>
										<ButtonTray>
											<Button icon={<Icons.Publish size={25} />} onClick={handleSubmitReorderedQuestions} title="Save changes" />
											<Button icon={<Icons.Close size={25} />} onClick={toggleReordering} title="Cancel Reordering" />
										</ButtonTray>
										{questions.map((question) => (
											<SortableItem key={question.QuestionID} id={question.QuestionID}>
												<ContentItem title={question.QuestionText}>
												</ContentItem>
											</SortableItem>
										))}
										<ButtonTray>
											<Button icon={<Icons.Publish size={25} />} onClick={handleSubmitReorderedQuestions} title="Save changes" />
											<Button icon={<Icons.Close size={25} />} onClick={toggleReordering} title="Cancel Reordering" />
										</ButtonTray>
									</ContentPanel>
								</DndContext>
							) : (
								<ContentPanel title="List of Questions">
									<ButtonTray>
										<Button icon={<Icons.Add size={25} />} onClick={handleAddQuestion} title="Add new question" />
										<Button icon={<Icons.Reorder size={25} />} onClick={toggleReordering} title="Reorder questions" />
									</ButtonTray>
									{questions.map((question) => (
										<ContentItem
											key={question.QuestionID}
											title={question.QuestionText}
											onClick={() => handleItemClick(question)}
											isSelected={selectedQuestion?.QuestionID === question.QuestionID}
										>
											<span className="option" onClick={handleEditDetails}><Icons.Edit />Edit Question Details</span>
											<span className="option" onClick={handleEditAnswers}><Icons.Edit />Edit Question Answers</span>
											<span className="option delete" onClick={handleDeleteQuestion}><Icons.Delete />Delete Question</span>
										</ContentItem>
									))}
									<ButtonTray>
										<Button icon={<Icons.Add size={25} />} onClick={handleAddQuestion} title="Add new question" />
										<Button icon={<Icons.Reorder size={25} />} onClick={toggleReordering} title="Reorder questions" />
									</ButtonTray>
								</ContentPanel>
							)}
							<div className={'quizEditorContent'}>
								<HoverMenu label = "File">
									Save as draft
									Preview
									Send for review
									Publish
									Edit Quiz Details
									Delete Quiz
								</HoverMenu>
								<Animate.FadeIn on={formType}>
									<div className={`quizEditorForm ${selectedQuestion && formType ? 'show' : ''}`}>
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
												questionsMessage={updateMessage}
											/>
										)}
										{selectedQuestion && formType === 'answers' && (
											<AnswerForm
												key={`${selectedQuestion.QuestionID}answers`}
												question={selectedQuestion}
												onSubmit={handleSubmitAnswers}
												onClose={() => {
													setSelectedQuestion(null);
													setFormType(null);
												}}
												answerMessage={updateMessage}
												mode="edit"
												header = {selectedQuestion.QuestionText}
											/>
										)}
									</div>
								</Animate.FadeIn>
								<ButtonTray>
									<Button className="headerButton">Previous</Button>
									<Button className="headerButton">Next</Button>
								</ButtonTray>
							</div>
						</div>
					</div>
			}
		</>
	);
};

export default QuizEditor;