import useLoad from '../api/useLoad';
import { Card, CardContainer } from '../components/UI/Card';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import CourseTray from '../components/UI/CourseTray';
import CourseForm from '../components/enitity/forms/CourseForm';
import API from '../api/API';
export default function CreatorDashboard() {
	// Inititalisation --------------------------------------------
	const { loggedInUser, loading } = useAuth();
	// State ------------------------------------------------------
	const [draftCourses, setDraftCourses, draftCoursesMessage, isLoadingDraft, loadDraftCourses] = useLoad('/courses?CourseCoursepublicationstatusID=1');
	const [publishedCourses, setPublishedCourses, publishedCoursesMessage, isLoadingPublished, loadPublishedCourses] = useLoad('/courses?CourseCoursepublicationstatusID=4');
	const [isFormVisible, setFormVisible] = useState(false);
	// Handlers ---------------------------------------------------
	const handleCourseSubmit = (data) => {
		API.post('/courses', data);
		loadDraftCourses();
		loadPublishedCourses();
		setFormVisible(false);
	};
	console.log(draftCourses)
	// View -------------------------------------------------------
	return (
		<>
			<button onClick={() => setFormVisible(!isFormVisible)}>
				{isFormVisible ? 'Close Form' : 'Add New Course'}
			</button>
			{isFormVisible && (
				<CourseForm onSubmit={handleCourseSubmit} />
			)}
			<CourseTray header='Draft Courses'>
				{
					<CardContainer>
						{
							draftCourses.map(course => (
								<Card key={course.id}>
									<p>{course.CourseName}</p>
									<p>{course.CourseDescription}</p>
								</Card>
							))
						}
					</CardContainer>
				}
			</CourseTray>
			<CourseTray header='Published Courses'>
				{
					<CardContainer>
						{
							publishedCourses.map(course => (
								<Card key={course.id}>
									<p>{course.CourseName}</p>
									<p>{course.CourseDescription}</p>
								</Card>
							))
						}
					</CardContainer>
				}
			</CourseTray>
		</>
	);
}