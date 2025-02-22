import useLoad from '../api/useLoad';
import { useState } from 'react';
import { Card, CardContainer } from '../components/UI/Card';
import CollapsiblePanel from '../components/UI/CollapsiblePanel';
import { ButtonTray, Button } from '../components/UI/Buttons';
import LessonForm from '../components/enitity/forms/LessonForm';
import QuizForm from '../components/enitity/forms/QuizForm';
import Modal from '../components/UI/modal/Modal';
import useApiActions from '../hooks/useApiActions';
import useNavigation from '../hooks/useNavigation';
import CourseForm from '../components/enitity/forms/CourseForm';
import './CreatorDashboard.scss';

export default function CreatorDashboard() {
	// Inititalisation --------------------------------------------
	const { post, put, delete: deleteRequest } = useApiActions();
	const { navigateToLessonEditor, navigateToQuizEditor, navigateToCourseEditor } = useNavigation();
	// State ------------------------------------------------------
	const [courses, ,,, loadCourses] = useLoad('/courses/mycourses');
	const [lessons, ,,, loadLessons] = useLoad('/lessons/mylessons?orderby=LessonPublicationstatusID,desc');
	const [quizzes, ,,, loadQuizzes] = useLoad('/quizzes/myquizzes');
	const [showModalForm, setShowModalForm] = useState({ show: false, type: '' });
	// Handlers ---------------------------------------------------
	const openModalForm = (type) =>{
		setShowModalForm({ show: !showModalForm.show, type });
	};

	// Submission ------------------------------------
	const handleLessonSubmit = async (data) => {
		const response = await post('/lessons', data, {
			successMessage: 'Lesson Created.',
			errorMessage: 'Lesson could not be created.',
		});

		if (response.isSuccess) {
			navigateToLessonEditor(response.result.data.LessonID);
		}
	};
	const handleQuizSubmit = async (data) => {
		const response = await post('/quizzes', data, {
			successMessage: 'Quiz Created.',
			errorMessage: 'Quiz could not be created.',
		});

		if (response.isSuccess) {
			navigateToQuizEditor(response.result.data.QuizID);
		}
	};
	const handleCourseSubmit = async (data) => {
		const response = await post('/courses', data, {
			successMessage: 'Course successfully created!',
			errorMessage: 'Course Creation failed!',
		});

		if (response.isSuccess) {
			navigateToCourseEditor(response.result.data.CourseID);
		}
	};
	// Deletion ------------------------------------
	const onDeleteLesson = async (id) => {
		if (window.confirm('Are you sure you want to delete this lesson?')) {
			await deleteRequest(`/lessons/${id}`, {
				successMessage: 'Lesson Deleted.',
				errorMessage: 'Lesson could not be deleted.',
			});
			loadLessons();
		}
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
		if (window.confirm('Are you sure you want to delete this course?')) {
			await deleteRequest(`/courses/${id}`, {
				successMessage: 'Course Deleted.',
				errorMessage: 'Course could not be deleted.',
			});
			loadCourses();
		}
	};
	// View -------------------------------------------------------
	return (
		<>
			<header className="dashboardHeader">
				<h1>Creator Dashboard</h1>
				<p>Manage your courses, lessons, and quizzes</p>
				<ButtonTray>
					<Button onClick={() => openModalForm('course')}>Create Course</Button>
					<Button onClick={() => openModalForm('lesson')}>Create Lesson</Button>
					<Button onClick={() => openModalForm('quiz')}>Create Quiz</Button>
				</ButtonTray>
			</header>
			{
				showModalForm.show && showModalForm.type === 'lesson' &&
				<Modal>
					<LessonForm onClose={() => openModalForm('lesson')} onSubmit={handleLessonSubmit} />
				</Modal>
			}
			{
				showModalForm.show && showModalForm.type === 'quiz' &&
				<Modal>
					<QuizForm onClose={() => openModalForm('quiz')} onSubmit={handleQuizSubmit}/>
				</Modal>
			}
			{
				showModalForm.show && showModalForm.type === 'course' &&
				<Modal>
					<CourseForm onClose={() => openModalForm('course')} onSubmit={handleCourseSubmit}/>
				</Modal>
			}
			<CollapsiblePanel header={`My Courses (${courses.length})`}>
				{
					<CardContainer>
						{
							courses.map(course => (
								<Card key={course.CourseID} status={course.CoursePublicationstatusName}>
									<div className="cardContent">
										<h3>{course.CourseName}</h3>
										<p>{course.CourseDescription}</p>
									</div>
									<ButtonTray>
										<Button className='formButton submitButton'onClick={() => navigateToCourseEditor(course.CourseID)}>Edit</Button>
										<Button className='deleteButton'onClick={() => onDeleteCourse(course.CourseID)}>Delete</Button>
									</ButtonTray>
								</Card>
							))
						}
					</CardContainer>
				}
			</CollapsiblePanel>
			<CollapsiblePanel header={`My Lessons (${lessons.length})`}>
				{
					<CardContainer>
						{
							lessons.map(lesson => (
								<Card key={lesson.LessonID} status={lesson.LessonPublicationstatusName}>
									<div className="cardContent">
										<h3>{lesson.LessonName}</h3>
										<p>{lesson.LessonDescription}</p>
									</div>
									<ButtonTray>
										<Button className='formButton submitButton'onClick={() => navigateToLessonEditor(lesson.LessonID)}>Edit</Button>
										<Button className='deleteButton'onClick={() => onDeleteLesson(lesson.LessonID)}>Delete</Button>
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
								<Card key={quiz.QuizID} status={quiz.QuizPublicationstatusName}>
									<div className="cardContent">
										<h3>{quiz.QuizName}</h3>
										<p>{quiz.QuizDescription}</p>
									</div>
									<ButtonTray>
										<Button onClick={() => navigateToQuizEditor(quiz.QuizID)}>Edit</Button>
										<Button onClick={() => onDeleteQuiz(quiz.QuizID)}>Delete</Button>
									</ButtonTray>
								</Card>
							))
						}
					</CardContainer>
				}
			</CollapsiblePanel>

		</>
	);
}