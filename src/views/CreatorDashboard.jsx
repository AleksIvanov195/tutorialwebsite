import useLoad from '../api/useLoad';
import { Card, CardContainer } from '../components/UI/Card';
import { useAuth } from '../hooks/useAuth';
import CollapsiblePanel from '../components/UI/CollapsiblePanel';
import { useNavigate } from 'react-router-dom';
export default function CreatorDashboard() {
	// Inititalisation --------------------------------------------
	const { loggedInUser, loading } = useAuth();
	const navigate = useNavigate();
	// State ------------------------------------------------------
	const [draftCourses, setDraftCourses, draftCoursesMessage, isLoadingDraft, loadDraftCourses] = useLoad('/courses?CourseCoursepublicationstatusID=1');
	const [publishedCourses, setPublishedCourses, publishedCoursesMessage, isLoadingPublished, loadPublishedCourses] = useLoad('/courses?CourseCoursepublicationstatusID=4');
	const [reviewedCourses, setReviewedCourses, reviewedCoursesMessage, isLoadingReviewed, loadReviewedCourses] = useLoad('/courses?CourseCoursepublicationstatusID=3');
	// Handlers ---------------------------------------------------

	const handleNavigateToCreateCourse = () =>{
		navigate('/createcourse');
	};
	// View -------------------------------------------------------
	return (
		<>
			<button onClick={handleNavigateToCreateCourse}> Create Course </button>

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