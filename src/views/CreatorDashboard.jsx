import useLoad from '../api/useLoad';
import { Card, CardContainer } from '../components/UI/Card';
import { useAuth } from '../hooks/useAuth';
import CourseTray from '../components/UI/CourseTray';
import { useNavigate } from 'react-router-dom';
export default function CreatorDashboard() {
	// Inititalisation --------------------------------------------
	const { loggedInUser, loading } = useAuth();
	const navigate = useNavigate();
	// State ------------------------------------------------------
	const [draftCourses, setDraftCourses, draftCoursesMessage, isLoadingDraft, loadDraftCourses] = useLoad('/courses?CourseCoursepublicationstatusID=1');
	const [publishedCourses, setPublishedCourses, publishedCoursesMessage, isLoadingPublished, loadPublishedCourses] = useLoad('/courses?CourseCoursepublicationstatusID=4');
	// Handlers ---------------------------------------------------

	const handleNavigateToCreateCourse = () =>{
		navigate('/createcourse');
	};
	// View -------------------------------------------------------
	return (
		<>
			<button onClick={handleNavigateToCreateCourse}> Create Course </button>

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