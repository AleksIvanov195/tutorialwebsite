import useLoad from '../api/useLoad';
import { useState } from 'react';
import { Card, CardContainer } from '../components/UI/Card';
import CollapsiblePanel from '../components/UI/CollapsiblePanel';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ButtonTray, Button } from '../components/UI/Buttons';
import LessonForm from '../components/enitity/forms/LessonForm';
import QuizForm from '../components/enitity/forms/QuizForm';
import Modal from '../components/UI/modal/Modal';
import toast from 'react-hot-toast';
import API from '../api/API';
import CourseForm from '../components/enitity/forms/CourseForm';

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
	// Handlers ---------------------------------------------------

	// Navigation ------------------------------------

	const handleNavigateToLessonEditor = (lessonID) =>{
		navigate('/lessoneditor', { state: { lessonID } });
	};

	const handleNavigateToQuizEditor = (quizID) =>{
		navigate('/quizeditor', { state: { quizID } });
	};

	const handleNavigateToCourseEditor = (courseID) =>{
		navigate('/courseeditor', { state: { courseID } });
	};

	const openForm = (type) =>{
		setShowForm({ show: !showForm.show, type });
	};

	// Submission ------------------------------------
	const handleLessonSubmit = async (data) => {
		const toastId = toast.loading('Saving...');
		const response = await API.post('/lessons', data, authState.isLoggedIn);
		if (response.isSuccess) {
			const lessonID = response.result.data.LessonID;
			handleNavigateToLessonEditor(lessonID);
			toast.success('Lesson Created.', { id:toastId });
		} else {
			toast.error(`Lesson could not be created. ${response.message}`, { id:toastId });
		}
	};
	const handleQuizSubmit = async (data) => {
		const toastId = toast.loading('Saving...');
		const response = await API.post('/quizzes', data, authState.isLoggedIn);
		if (response.isSuccess) {
			const quizID = response.result.data.QuizID;
			handleNavigateToQuizEditor(quizID);
			toast.success('Quiz Created.', { id:toastId });
		} else {
			toast.error(`Quiz could not be created. ${response.message}`, { id:toastId });
		}
	};
	const handleCourseSubmit = async (data) => {
		const toastId = toast.loading('Saving...');
		const response = await API.post('/courses', data, authState.isLoggedIn);
		if (response.isSuccess) {
			const courseID = response.result.data.CourseID;
			handleNavigateToCourseEditor(courseID);
			toast.success('Course successfully created!', { id:toastId });
		} else {
			toast.error(`Course Creation failed! ${response.message}`, { id:toastId });
		}
	};
	// Deletion ------------------------------------
	const onDeleteLesson = async (id) =>{
		const toastId = toast.loading('Deleting...');
		const response = await API.delete(`/lessons/${id}`, authState.isLoggedIn);
		if (response.isSuccess) {
			loadLessons();
			toast.success('Lesson Deleted.', { id:toastId });
		} else {
			toast.error(`Lesson could not be deleted. ${response.message}`, { id:toastId });
		}
	};
	const onDeleteQuiz = async (id) =>{
		// const confirmDiscard = window.confirm('Are you sure you want to delete this quiz, you will LOSE ALL CONTENT?');
	};
	const onDeleteCourse = async (id) =>{
		// const confirmDiscard = window.confirm('Are you sure you want to delete this quiz, you will LOSE ALL CONTENT?');
	};
	// View -------------------------------------------------------
	return (
		<>
			<ButtonTray>
				<Button onClick={() => openForm('course') }>Create Course</Button>
				<Button onClick={() => openForm('lesson') }>Create Lesson</Button>
				<Button onClick={() => openForm('quiz') }>Create Quiz</Button>
			</ButtonTray>
			{
				showForm.show && showForm.type === 'lesson' &&
				<Modal>
					<LessonForm onClose={() => openForm('lesson')} onSubmit={handleLessonSubmit} />
				</Modal>
			}
			{
				showForm.show && showForm.type === 'quiz' &&
				<Modal>
					<QuizForm onClose={() => openForm('quiz')} onSubmit={handleQuizSubmit}/>
				</Modal>
			}
			{
				showForm.show && showForm.type === 'course' &&
				<Modal>
					<CourseForm onClose={() => openForm('course')} onSubmit={handleCourseSubmit}/>
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
										<Button onClick={() => handleNavigateToQuizEditor(quiz.QuizID)}>Edit</Button>
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