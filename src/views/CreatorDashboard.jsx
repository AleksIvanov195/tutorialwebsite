import useLoad from '../api/useLoad';
import { Card, CardContainer } from '../components/UI/Card';
import { useAuth } from '../hooks/useAuth';
import CourseTray from '../components/UI/CourseTray';
export default function CreatorDashboard() {
	// Inititalisation --------------------------------------------
	const { loggedInUser, loading } = useAuth();
	// State ------------------------------------------------------
	const [draftCourses, setDraftCourses, draftCoursesMessage, isLoadingDraft, loadDraftCourses] = useLoad('/courses?CourseCoursepublicationstatusID=1');
	const [publishedCourses, setPublishedCourses, publishedCoursesMessage, isLoadingPublished, loadPublishedCourses] = useLoad('/courses?CourseCoursepublicationstatusID=4');
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	console.log(draftCourses);
	return (
		<>
			<CourseTray header='Draft Courses'>
				{
					<CardContainer>
						{
							draftCourses.map(course => (
								<Card key={course.id}>
									<p>{course.CourseName}</p>
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
								</Card>
							))
						}
					</CardContainer>
				}
			</CourseTray>
		</>
	);
}