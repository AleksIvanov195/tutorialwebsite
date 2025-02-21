import useLoad from '../api/useLoad';
import { useState } from 'react';
import { Card, CardContainer } from '../components/UI/Card';
import CollapsiblePanel from '../components/UI/CollapsiblePanel';
import { useNavigate } from 'react-router-dom';
import { ButtonTray, Button } from '../components/UI/Buttons';
import LessonForm from '../components/enitity/forms/LessonForm';
import QuizForm from '../components/enitity/forms/QuizForm';
import Modal from '../components/UI/modal/Modal';
import useApiActions from '../hooks/useApiActions';
import CourseForm from '../components/enitity/forms/CourseForm';

export default function CreatorDashboard() {
	// Inititalisation --------------------------------------------
	const { post, put, delete: deleteRequest } = useApiActions();
	const navigate = useNavigate();
	// State ------------------------------------------------------
	const [draftCourses ] = useLoad('/courses?CoursePublicationstatusID=1');
	const [publishedCourses ] = useLoad('/courses?CoursePublicationstatusID=4');
	const [reviewedCourses ] = useLoad('/courses?CoursePublicationstatusID=3');
	const [lessons, ,,, loadLessons] = useLoad('/lessons/mylessons');
	const [quizzes, ,,, loadQuizzes] = useLoad('/quizzes/myquizzes');
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
		const response = await post('/lessons', data, {
			successMessage: 'Lesson Created.',
			errorMessage: 'Lesson could not be created.',
		});

		if (response.isSuccess) {
			handleNavigateToLessonEditor(response.result.data.LessonID);
		}
	};
	const handleQuizSubmit = async (data) => {
		const response = await post('/quizzes', data, {
			successMessage: 'Quiz Created.',
			errorMessage: 'Quiz could not be created.',
		});

		if (response.isSuccess) {
			handleNavigateToQuizEditor(response.result.data.QuizID);
		}
	};
	const handleCourseSubmit = async (data) => {
		const response = await post('/courses', data, {
			successMessage: 'Course successfully created!',
			errorMessage: 'Course Creation failed!',
		});

		if (response.isSuccess) {
			handleNavigateToCourseEditor(response.result.data.CourseID);
		}
	};
	// Deletion ------------------------------------
	const onDeleteLesson = async (id) => {
		await deleteRequest(`/lessons/${id}`, {
			successMessage: 'Lesson Deleted.',
			errorMessage: 'Lesson could not be deleted.',
		});
		loadLessons();
	};
	const onDeleteQuiz = async (id) =>{
		if (window.confirm('Are you sure you want to delete this quiz? You will LOSE ALL Questions & Answers?')) {
			await deleteRequest(`/quizzes/${id}`, {
				successMessage: 'Quiz Deleted.',
				errorMessage: 'Quiz could not be deleted.',
			});
			loadQuizzes();
		}
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