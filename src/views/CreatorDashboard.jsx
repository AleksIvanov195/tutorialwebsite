import useLoad from '../api/useLoad';
import { Card, CardContainer } from '../components/UI/Card';
import CollapsiblePanel from '../components/UI/CollapsiblePanel';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ButtonTray, Button } from '../components/UI/Buttons';
export default function CreatorDashboard() {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	const navigate = useNavigate();
	// State ------------------------------------------------------
	const [draftCourses, setDraftCourses, draftCoursesMessage, isLoadingDraft, loadDraftCourses] = useLoad('/courses?CoursePublicationstatusID=1', authState.isLoggedIn);
	const [publishedCourses, setPublishedCourses, publishedCoursesMessage, isLoadingPublished, loadPublishedCourses] = useLoad('/courses?CoursePublicationstatusID=4', authState.isLoggedIn);
	const [reviewedCourses, setReviewedCourses, reviewedCoursesMessage, isLoadingReviewed, loadReviewedCourses] = useLoad('/courses?CoursePublicationstatusID=3', authState.isLoggedIn);
	// Handlers ---------------------------------------------------

	const handleNavigateToCreateCourse = () =>{
		navigate('/createcourse');
	};
	const handleNavigateToCreateLesson = () =>{
		navigate('/createlesson');
	};
	// View -------------------------------------------------------
	return (
		<>
			<ButtonTray>
				<Button onClick={handleNavigateToCreateCourse}>Create Course</Button>
				<Button onClick={handleNavigateToCreateLesson}>Create Lesson</Button>
			</ButtonTray>

			<CollapsiblePanel header={`Draft Courses (${draftCourses.length})`}>
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
			</CollapsiblePanel>
			<CollapsiblePanel header={`Reviewed/Ready for Publication Courses (${reviewedCourses.length})`}>
				{
					<CardContainer>
						{
							reviewedCourses.map(course => (
								<Card key={course.id}>
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
								<Card key={course.id}>
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