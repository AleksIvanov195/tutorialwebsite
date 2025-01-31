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
import Modal from '../../components/UI/Modal';
import QuizForm from '../../components/enitity/forms/QuizForm';

const QuizEditor = () => {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	const location = useLocation();
	const { quizID } = location.state || { quizID: null };
	// State ------------------------------------------------------
	const [quiz, setQuiz, quizMessage, isQuizLoading, loadQuiz] = useLoad(`/quizzes?QuizID=${quizID}`, authState.isLoggedIn);
	const [questions, setQuestions, questionsMessage, isLoading, loadQuestions] = useLoad(`/questions?QuestionQuizID=${quizID}&orderby=QuestionOrdernumber,ASC`, authState.isLoggedIn);
	const [selectedQuestion, setSelectedQuestion] = useState(null);
	const [formType, setFormType] = useState(null);
	const [updateMessage, setUpdateMessage] = useState('');
	const [isReordering, setIsReordering] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const initialQuestions = useRef([]);
	// Handlers ---------------------------------------------------
	const handleItemClick = (question) => {
		setUpdateMessage('');
		setSelectedQuestion(question);
	};
	const handleEditDetails = () => {
		setUpdateMessage('');
		setFormType('details');
	};

	const handleEditAnswers = () => {
		setUpdateMessage('');
		setFormType('answers');
	};
	const handleGoToNextQuestion = () =>{
		if (selectedQuestion) {
			const index = questions.findIndex(q => q.QuestionID === selectedQuestion.QuestionID);
			if (index < questions.length - 1) {
				setSelectedQuestion(questions[index + 1]);
			}
		}else{
			setSelectedQuestion(questions[0]);
		}
	};
	const handleGoToPreviousQuestion = () =>{
		if (selectedQuestion) {
			const index = questions.findIndex(q => q.QuestionID === selectedQuestion.QuestionID);
			if (index > 0) {
				setSelectedQuestion(questions[index - 1]);
			}
		}
	};

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
			setFormType('answers');
			alert('Answers could not be updated');
		} else {
			setUpdateMessage(`Answers Update failed: ${response.message}`);
		}
	};
	const handleSaveQuizDetails = async (data)=>{
		const response = await API.put(`/quizzes/${quiz[0].QuizID}`, data, authState.isLoggedIn);
		if (response.isSuccess) {
			loadQuiz();
			setUpdateMessage('Quiz details have been updated.');
			openModal();
		}else{
			setUpdateMessage(`Quiz Update failed: ${response.message}`);
		}
	};
	const changeQuizStatus = async (statusID) =>{
		const quizData = { QuizPublicationstatusID: statusID };
		const response = await API.put(`/quizzes/${quiz[0].QuizID}`, quizData, authState.isLoggedIn);

	};
	const openModal = () =>{
		setShowModal(!showModal);
		setUpdateMessage('');
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
							<div className="headerContainer">
								<HoverMenu label="Options">
									<a onClick = {() => changeQuizStatus(1)}><Icons.Draft/> &nbsp; Save as Draft</a>
									<a ><Icons.Preview/>&nbsp;Preview</a>
									<a onClick = {() => changeQuizStatus(2)}><Icons.Review/>&nbsp;Send for Review</a>
									<a ><Icons.Discard/>&nbsp;Delete Quiz</a>
									<a onClick = {() => changeQuizStatus(4)}><Icons.Publish/>&nbsp;Publish</a>
									<a onClick={openModal}><Icons.Edit/>&nbsp;Edit Details</a>
								</HoverMenu>
								<h1>{!isQuizLoading && quiz[0].QuizName}</h1>
							</div>
						</header>
						<div className="quizEditorBody">
							{
								showModal &&
						<Modal>
							<QuizForm
								initialValues={{ QuizName: quiz[0].QuizName, QuizDescription: quiz[0].QuizDescription }}
								quizMessage={updateMessage}
								onSubmit={handleSaveQuizDetails }
								onClose={openModal}
								mode={'edit'}/>
						</Modal>
							}
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
									<Button onClick={handleGoToPreviousQuestion} className="headerButton" icon = {<Icons.Previous/>}/>
									<Button onClick={handleGoToNextQuestion} className="headerButton" icon = {<Icons.Next/>}/>
								</ButtonTray>
							</div>
						</div>
					</div>
			}
		</>
	);
};

export default QuizEditor;