import useLoad from '../api/useLoad';
import { useState } from 'react';
import { Card, CardContainer } from '../components/UI/Card';
import CollapsiblePanel from '../components/UI/CollapsiblePanel';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ButtonTray, Button } from '../components/UI/Buttons';
import LessonForm from '../components/enitity/forms/LessonForm';
import QuizForm from '../components/enitity/forms/QuizForm';
import Modal from '../components/UI/Modal';
import API from '../api/API';
export default function CreatorDashboard() {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	const navigate = useNavigate();
	// State ------------------------------------------------------
	const [draftCourses ] = useLoad('/courses?CoursePublicationstatusID=1', authState.isLoggedIn);
	const [publishedCourses ] = useLoad('/courses?CoursePublicationstatusID=4', authState.isLoggedIn);
	const [reviewedCourses ] = useLoad('/courses?CoursePublicationstatusID=3', authState.isLoggedIn);
	const [lessons, ,,, loadLessons] = useLoad('/lessons/mylessons', authState.isLoggedIn);
	const [quizzes, ,,, loadQuizzes] = useLoad('/quizzes/myquizzes', authState.isLoggedIn);
	const [showForm, setShowForm] = useState({ show: false, type: '' });
	const [messages, setMessages] = useState({ lessonMessage: '', quizMessage: '' });
	// Handlers ---------------------------------------------------

	const handleNavigateToCreateCourse = () =>{
		navigate('/createcourse');
	};
	const handleNavigateToLessonEditor = (lessonID) =>{
		navigate('/lessoneditor', { state: { lessonID } });
	};
	const handleNavigateToQuizEditor = (quizID, quizName) =>{
		navigate('/quizeditor', { state: { quizID, quizName } });
	};
	const openForm = (type) =>{
		setShowForm({ show: !showForm.show, type });
		if (showForm.show) {
			setMessages({ lessonMessage: '', quizMessage: '' });
		}
	};

	const handleLessonSubmit = async (data) => {
		const response = await API.post('/lessons', data, authState.isLoggedIn);
		if (response.isSuccess) {
			const lessonID = response.result.data.LessonID;
			navigate('/lessoneditor', { state: { lessonID } });
		} else {
			setMessages({ ...messages, lessonMessage: `Lesson Creation failed: ${response.message}` });
		}
	};
	const handleQuizSubmit = async (data) => {
		const response = await API.post('/quizzes', data, authState.isLoggedIn);
		if (response.isSuccess) {
			const quizID = response.result.data.QuizID;
			const quizName = response.result.data.Quizname;
			navigate('/quizeditor', { state: { quizID, quizName } });
		} else {
			setMessages({ ...messages, quizMessage: `Quiz Creation failed: ${response.message}` });
		}
	};
	const onDeleteLesson = async (id) =>{
		const response = await API.delete(`/lessons/${id}`, authState.isLoggedIn);
		if (response.isSuccess) {
			alert('Lesson Deleted');
			loadLessons();
		} else {alert(`Something went wrong: ${response.message}`);}
	};
	const onDeleteQuiz = async (id) =>{
		//const confirmDiscard = window.confirm('Are you sure you want to delete this quiz, you will LOSE ALL CONTENT?');
	};
	// View -------------------------------------------------------
	return (
		<>
			<ButtonTray>
				<Button onClick={handleNavigateToCreateCourse}>Create Course</Button>
				<Button onClick={() => openForm('lesson') }>Create Lesson</Button>
				<Button onClick={() => openForm('quiz') }>Create Quiz</Button>
			</ButtonTray>
			{
				showForm.show && showForm.type === 'lesson' &&
				<Modal>
					<LessonForm onClose={() => openForm('lesson')} onSubmit={handleLessonSubmit} lessonMessage={messages.lessonMessage} />
				</Modal>
			}
			{
				showForm.show && showForm.type === 'quiz' &&
				<Modal>
					<QuizForm onClose={() => openForm('quiz')} onSubmit={handleQuizSubmit} quizMessage={messages.quizMessage}/>
				</Modal>
			}
			<CollapsiblePanel header={`My Lessons (${lessons.length})`}>
				{
					<CardContainer>
						{
							lessons.map(lesson => (
								<Card key={lesson.LessonID}>
									<p>{lesson.LessonName}</p>
									<p>{lesson.LessonDescription}</p>
									<ButtonTray>
										<Button onClick={() => handleNavigateToLessonEditor(lesson.LessonID)}>Edit</Button>
										<Button onClick={() => onDeleteLesson(lesson.LessonID)}>Delete</Button>
									</ButtonTray>
								</Card>
							))
						}
					</CardContainer>
				}
			</CollapsiblePanel>
			<CollapsiblePanel header={`My Quizzes (${quizzes.length})`}>
				{
					<CardContainer>
						{
							quizzes.map(quiz => (
								<Card key={quiz.QuizID}>
									<p>{quiz.QuizName}</p>
									<p>{quiz.QuizDescription}</p>
									<ButtonTray>
										<Button onClick={() => handleNavigateToQuizEditor(quiz.QuizID, quiz.QuizName)}>Edit</Button>
										<Button onClick={() => onDeleteQuiz(quiz.QuizID)}>Delete</Button>
									</ButtonTray>
								</Card>
							))
						}
					</CardContainer>
				}
			</CollapsiblePanel>
			<CollapsiblePanel header={`Draft Courses (${draftCourses.length})`}>
				{
					<CardContainer>
						{
							draftCourses.map(course => (
								<Card key={course.CourseID}>
									<p>{course.CourseName}</p>
									<p>{course.CourseDescription}</p>
								</Card>
							))
						}
					</CardContainer>
				}
			</CollapsiblePanel>
			<CollapsiblePanel header={`Reviewed/Ready for Publication Courses (${reviewedCourses.length})`}>
				{
					<CardContainer>
						{
							reviewedCourses.map(course => (
								<Card key={course.CourseID}>
									<p>{course.CourseName}</p>
									<p>{course.CourseDescription}</p>
								</Card>
							))
						}
					</CardContainer>
				}
			</CollapsiblePanel>
			<CollapsiblePanel header={`Published Courses (${publishedCourses.length})`}>
				{
					<CardContainer>
						{
							publishedCourses.map(course => (
								<Card key={course.CourseID}>
									<p>{course.CourseName}</p>
									<p>{course.CourseDescription}</p>
								</Card>
							))
						}
					</CardContainer>
				}
			</CollapsiblePanel>

		</>
	);
}