import useLoad from '../api/useLoad';
import { useState } from 'react';
import { Card, CardContainer } from '../components/UI/Card';
import CollapsiblePanel from '../components/UI/CollapsiblePanel';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ButtonTray, Button } from '../components/UI/Buttons';
import LessonForm from '../components/enitity/forms/LessonForm';
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
	const [lessons ] = useLoad('/lessons', authState.isLoggedIn);
	const [showLessonForm, setShowLessonForm] = useState(false);
	const [lessonMessage, setLessonMessage] = useState('');
	// Handlers ---------------------------------------------------

	const handleNavigateToCreateCourse = () =>{
		navigate('/createcourse');
	};
	const handleLessonSubmit = async (data) => {
		console.log(data);
		const response = await API.post('/lessons', data, authState.isLoggedIn);
		if (response.isSuccess) {
			const lessonID = response.result.data.LessonID;
			navigate('/lessoneditor', { state: { lessonID } });
		} else {
			setLessonMessage(`Lesson Creation failed: ${response.message}`);
		}
	};
	const handleNavigateToLessonEditor = (lessonID) =>{
		navigate('/lessoneditor', { state: { lessonID } });
	};
	const openLessonForm = () =>{
		setShowLessonForm(!showLessonForm);
	};
	// View -------------------------------------------------------
	return (
		<>
			<ButtonTray>
				<Button onClick={handleNavigateToCreateCourse}>Create Course</Button>
				<Button onClick={openLessonForm }>Create Lesson</Button>
			</ButtonTray>
			{
				showLessonForm &&
				<Modal>
					<LessonForm onClose={openLessonForm} onSubmit={handleLessonSubmit} lessonMessage={lessonMessage}/>
				</Modal>
			}
			<CollapsiblePanel header={`Lessons (${lessons.length})`}>
				{
					<CardContainer>
						{
							lessons.map(lesson => (
								<Card key={lesson.LessonID}>
									<p>{lesson.LessonName}</p>
									<p>{lesson.LessonDescription}</p>
									<Button onClick={() => handleNavigateToLessonEditor(lesson.LessonID)}>Edit</Button>
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