import { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import useLoad from '../../api/useLoad';
import API from '../../api/API';
import { Button, ButtonTray } from '../../components/UI/Buttons';
import QuestionForm from '../../components/enitity/forms/QuestionForm';
import AnswerForm from '../../components/enitity/forms/AnswerForm';
import './QuizEditor.scss';
import Icons from '../../components/UI/Icons';
import Animate from '../../components/UI/Animate';
import HoverMenu from '../../components/UI/HoverMenu';
import Modal from '../../components/UI/modal/Modal';
import QuizForm from '../../components/enitity/forms/QuizForm';
import { SortableContentItem, SortableContentPanel } from '../../components/UI/contentpanel/SortableContentPanel';
import { toast } from 'react-hot-toast';

const QuizEditor = () => {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	const location = useLocation();
	const { quizID } = location.state || { quizID: null };
	// State ------------------------------------------------------
	const [quiz, setQuiz, quizMessage, isQuizLoading, loadQuiz] = useLoad(`/quizzes/${quizID}`, authState.isLoggedIn);
	const [questions, setQuestions, questionsMessage, isLoading, loadQuestions] = useLoad(`/questions?QuestionQuizID=${quizID}&orderby=QuestionOrdernumber,ASC`, authState.isLoggedIn);
	const [selectedQuestion, setSelectedQuestion] = useState(null);
	const [formType, setFormType] = useState(null);
	const [isReordering, setIsReordering] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const initialQuestions = useRef([]);
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
		const toastId = toast.loading('Adding Question...');
		const newQuestion = {
			QuestionText: '',
			QuestionFeedbacktext: '',
			QuestionType: 'MultipleChoice',
			QuestionOrdernumber: questions.length + 1,
			QuestionQuizID: quizID,
		};
		const response = await API.post('/questions', newQuestion, authState.isLoggedIn);
		if (response.isSuccess) {
			loadQuestions();
			setSelectedQuestion(response.result.data);
			toast.success('Question Added.', { id:toastId });
		} else {
			toast.error(`Question could not be added. ${response.message}`, { id:toastId });
		}
	};
	const handleEditQuestion = async (data) => {
		const toastId = toast.loading('Updating Question...');
		const response = await API.put(`/questions/${selectedQuestion.QuestionID}`, data, authState.isLoggedIn);
		if (response.isSuccess) {
			loadQuestions();
			setSelectedQuestion(response.result.data);
			toast.success('Question Updated.', { id:toastId });
		} else {
			toast.error(`Question could not be updated. ${response.message}`, { id:toastId });
		}
	};
	const handleDeleteQuestion = async () => {
		const toastId = toast.loading('Updating Question...');
		const response = await API.delete(`/questions/${selectedQuestion.QuestionID}`, authState.isLoggedIn);
		if (response.isSuccess) {
			loadQuestions();
			setSelectedQuestion(response.result.data);
			toast.success('Question Deleted.', { id:toastId });
		} else {
			toast.error(`Question could not be deleted. ${response.message}`, { id:toastId });
		}
	};

	const handleSubmitReorderedQuestions = async () => {
		const toastId = toast.loading('Updating Question...');
		const responses = await Promise.all(
			questions.map((question, index) =>
				API.put(`/questions/${question.QuestionID}`, { QuestionOrdernumber: index + 1 }, authState.isLoggedIn),
			),
		);
		const success = responses.every(response => response.isSuccess);

		setIsReordering(false);
		loadQuestions();

		if (success) {
			toast.success('Questions Reordered.', { id: toastId });
		} else {
			const errorMessage = responses.find(response => !response.isSuccess).message;
			toast.error(`Something went wrong while reordering, please try again! ${errorMessage}`, { id: toastId });
		}
	};
	const handleSubmitAnswers = async ({ addedAnswers, removedAnswers, updatedAnswers }) => {
		const toastId = toast.loading('Updating Question...');
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
			setFormType('details');
			toast.success('Answers Updated.', { id:toastId });
		} else {
			toast.error(`Answers Failed to Update. ${response.message}`, { id:toastId });
		}
	};
	const handleSaveQuizDetails = async (data)=>{
		const toastId = toast.loading('Updating Question...');
		const response = await API.put(`/quizzes/${quiz[0].QuizID}`, data, authState.isLoggedIn);
		if (response.isSuccess) {
			loadQuiz();
			toast.success('Quiz Details Updated.', { id:toastId });
			openModal();
		}else{
			toast.error(`Quiz Failed to Update. ${response.message}`, { id:toastId });
		}
	};
	const changeQuizStatus = async (statusID) =>{
		const toastId = toast.loading('Updating Question...');
		const quizData = { QuizPublicationstatusID: statusID };
		const response = await API.put(`/quizzes/${quiz[0].QuizID}`, quizData, authState.isLoggedIn);
		if(response.isSuccess) {
			toast.success('Quiz Status Updated.', { id:toastId });
		}else{
			toast.error(`Quiz Status Failed to Update. ${response.message}`, { id:toastId });
		}

	};
	const handlePreview = () => {
		sessionStorage.setItem('previewQuizID', quiz[0].QuizID);
		window.open('/previewquiz', '_blank');
	};
	const openModal = () =>{
		setShowModal(!showModal);
	};
	const toggleReordering = () => {
		if (isReordering) {
			// Revert to initial order if reordering is canceled
			setQuestions(initialQuestions.current);
			toast.error('Reordering cancelled.');
		} else {
			// Store the initial order before reordering
			initialQuestions.current = questions;
			toast.success('Reordering enabled.');
		}
		setIsReordering(!isReordering);
	};

	// View -------------------------------------------------------
	const panelButtons =
	<ButtonTray>
		{isReordering ?
			<>
				<Button icon={<Icons.Publish size={25} />} onClick={handleSubmitReorderedQuestions} title="Save changes" />
				<Button icon={<Icons.Close size={25} />} onClick={toggleReordering} title="Cancel Reordering" />
			</>
			:
			<>
				<Button icon={<Icons.Add size={25} />} onClick={handleAddQuestion} title="Add new question" />
				<Button icon={<Icons.Reorder size={25} />} onClick={toggleReordering} title="Reorder questions" />
			</>
		}
	</ButtonTray>;

	if(isLoading) {
		return(
			<>
				<p>Loading content...</p>
			</>
		);
	}

	return (
		<div className="quizEditor">
			<header className="quizEditorHeader">
				<div className="headerContainer">
					<ButtonTray className={'headerButtonTray'}>
						<HoverMenu label="Options">
							<a onClick = {() => changeQuizStatus(2)}><Icons.Review/>&nbsp;Send for Review</a>
							<a ><Icons.Discard/>&nbsp;Delete</a>
							<a onClick = {() => changeQuizStatus(4)}><Icons.Publish/>&nbsp;Publish</a>
							<a onClick={openModal}><Icons.Edit/>&nbsp;Edit Quiz</a>
						</HoverMenu>
						<Button onClick={() => changeQuizStatus(1)} icon = {<Icons.Draft size = {28}/>} title = 'Save Quiz as Draft'/>
						<Button onClick={handlePreview} icon = {<Icons.Preview size = {30}/>} title = 'Preview Quiz'/>
					</ButtonTray>
					<h1>{!isQuizLoading && quiz[0].QuizName}</h1>
				</div>
			</header>
			<div className="quizEditorBody">
				{
					showModal &&
						<Modal>
							<QuizForm
								initialValues={{ QuizName: quiz[0].QuizName, QuizDescription: quiz[0].QuizDescription }}
								onSubmit={handleSaveQuizDetails }
								onClose={openModal}
								mode={'edit'}/>
						</Modal>
				}
				<SortableContentPanel
					title={isReordering ? 'Reordering Enabled' : 'List of Questions'}
					items={questions}
					setItems={setQuestions}
					idField="QuestionID"
					isReordering={isReordering}>

					{panelButtons}
					{questions.map((question) => (
						<SortableContentItem key={question.QuestionID} id={question.QuestionID}
							title={question.QuestionText}
							onClick={() => handleItemClick(question)}
							isSelected={selectedQuestion?.QuestionID === question.QuestionID}
							isReordering={isReordering}>

							<span className="option" onClick={handleEditDetails}><Icons.Edit />Edit Question</span>
							<span className="option" onClick={handleEditAnswers}><Icons.Edit />Edit Answers</span>
							<span className="option delete" onClick={handleDeleteQuestion}><Icons.Delete />Delete Question</span>
						</SortableContentItem>
					))}
					{panelButtons}
				</SortableContentPanel>
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
									quiz={{ QuizID: quizID }}
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
									mode="edit"
									header = {selectedQuestion.QuestionText}
								/>
							)}
						</div>
					</Animate.FadeIn>
					<ButtonTray>
						<Button onClick={handleGoToPreviousQuestion} className="headerButton" icon = {<Icons.Previous/>} title = 'Previous Question' />
						<Button onClick={handleGoToNextQuestion} className="headerButton" icon = {<Icons.Next/>} title = 'Next Question'/>
					</ButtonTray>
				</div>
			</div>
		</div>
	);
};

export default QuizEditor;